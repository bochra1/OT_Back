import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OTRequest } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class OTRequestService {
  constructor(private prisma: PrismaService) {}

  async generateLotNumber(userId: string, role: string) {
    const year = new Date().getFullYear();
    const count = await this.prisma.oTRequest.count({
      where: {
        creatorId: userId,
        lotNumber: { contains: `.${year}` },
      },
    });
    const number = String(count + 1).padStart(3, '0');
    return `${role}.${number}.${year}`;
  }

  async createOT(userId: string, role: string, data: any) {
    // Validate that creator user exists
    const creator = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!creator) {
      throw new BadRequestException(`Creator user with ID ${userId} not found`);
    }

    const lotNumber = await this.generateLotNumber(userId, role);

    // Parse customFields if it's a JSON string
    let customFields = data.customFields || [];
    if (typeof customFields === 'string') {
      customFields = JSON.parse(customFields);
    }

    // Stocker les fichiers sur le disque
    const attachmentsData: { filename: string; mimetype: string; filepath: string; size: number }[] = [];
    for (const file of data.attachments || []) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      const uploadPath = path.join(__dirname, '../../uploads', filename);

      fs.writeFileSync(uploadPath, file.buffer);

      attachmentsData.push({
        filename: file.originalname,
        mimetype: file.mimetype,
        filepath: filename,
        size: file.size || file.buffer.length,
      });
    }

    // Prepare intervenants: accept array or comma-separated string or single id
    let intervenantsInput: string[] = [];
    if (data.intervenants) {
      if (Array.isArray(data.intervenants)) intervenantsInput = data.intervenants;
      else if (typeof data.intervenants === 'string') {
    // Cas où c'est une string JSON : '["id"]'
    try {
      const parsed = JSON.parse(data.intervenants);
      if (Array.isArray(parsed)) intervenantsInput = parsed;
      else intervenantsInput = [data.intervenants];
    } catch {
      // Si ce n'est pas JSON, split sur ',' ou utiliser la string directement
      intervenantsInput = data.intervenants.split(',').map(s => s.trim());
    }
  }
}

    const intervenantsCreate = intervenantsInput.map((uid) => ({ userId: uid }));

    const status =  'OPEN';

    // Validate that all intervenant users exist
    if (intervenantsCreate.length > 0) {
      const validUserIds = await this.prisma.user.findMany({
        where: {
          id: { in: intervenantsInput },
        },
        select: { id: true },
      });

      const validIds = validUserIds.map(u => u.id);
      const invalidIds = intervenantsInput.filter(id => !validIds.includes(id));
console.log('Intervenants input:', intervenantsInput, 'Validating intervenants. Valid IDs:', validIds, 'Invalid IDs:', invalidIds);
      if (invalidIds.length > 0) {
        throw new BadRequestException(`Invalid user IDs: ${invalidIds.join(', ')}`);
      }
    }

    return this.prisma.oTRequest.create({
      data: {
        title: data.title,
        workPlace: data.workPlace,
        action: data.action,
        workDate: data.workDate ? new Date(data.workDate) : null,
        contactTT: data.contactTT,
        impact: data.impact || '',
        comment: data.comment || '',
        priority: data.priority || 'NORMAL',
        lotNumber,
        creatorId: userId,
        status,

        // Custom fields as JSON
        customFields: customFields.length > 0 ? customFields : null,

        // Attachments
        attachments: {
          create: attachmentsData,
        },

        // Intervenants (relations to existing users)
        intervenants: intervenantsCreate.length > 0 ? { create: intervenantsCreate } : undefined,
      },
      include: {
        attachments: true,
        intervenants: { include: { user: true } },
      },
    });
  }

  async getUserOTs(userId: string) { //created by user
    return this.prisma.oTRequest.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true,
        intervenants: { include: { user: true, assignedBy: true } },
      },
    });
  }

  async getAssignedToMe(userId: string) {
    return this.prisma.oTRequest.findMany({
      where: {
        intervenants: {
          some: { userId },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true,
        intervenants: { include: { user: true, assignedBy: true } },
        creator: true,
      },
    });
  }
async getAllMyOTs(userId: string) {
  return this.prisma.oTRequest.findMany({
    where: {
      OR: [
        { creatorId: userId }, // created by me
        {
          intervenants: {
            some: { userId }, // assigned to me
          },
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      attachments: true,
      creator: true,
      intervenants: {
        include: {
          user: true,
          assignedBy: true,
        },
      },
    },
  });
}

 
  async getRequestsByType(otTypeId: string): Promise<OTRequest[]> {
    return this.prisma.oTRequest.findMany({
      where: { otTypeId },
    });
  }

  async updateStatus(requestId: string, status: string): Promise<OTRequest> {
    return this.prisma.oTRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  async getRequestById(id: string): Promise<OTRequest | null> {
    return this.prisma.oTRequest.findUnique({
      where: { id },
      include: {
        attachments: true,
        intervenants: { include: { user: true, assignedBy: true } },
        startedBy: true,
        closedBy: true,
        creator: true,
      },
    });
  }

  // Assign intervenants to an existing OT (does not change lifecycle status)
  async assignIntervenants(otId: string, userIds: string[], assignedById?: string) {
    const ot = await this.prisma.oTRequest.findUnique({ where: { id: otId } });
    if (!ot) throw new BadRequestException('OT not found');

    // Validate users
    const users = await this.prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true } });
    const existingIds = users.map(u => u.id);
    const invalid = userIds.filter(id => !existingIds.includes(id));
    if (invalid.length) throw new BadRequestException(`Invalid user IDs: ${invalid.join(', ')}`);

    // Create intervenant records if not already present
    const created: any[] = [];
    for (const uid of userIds) {
      const exists = await this.prisma.oTIntervenant.findFirst({ where: { otId, userId: uid } });
      if (!exists) {
        const rec = await this.prisma.oTIntervenant.create({ data: { otId, userId: uid, assignedById: assignedById || null } });
        created.push(rec);
      }
    }
    return { createdCount: created.length };
  }

  // Start the OT: must be OPEN and user must be one of intervenants
  async startOT(otId: string, userId: string) {
    const ot = await this.prisma.oTRequest.findUnique({ where: { id: otId }, include: { intervenants: true } });
    if (!ot) throw new BadRequestException('OT not found');
    if (ot.status !== 'OPEN') throw new BadRequestException('OT must be OPEN to start');

    const assigned = ot.intervenants.map(i => i.userId);
    console.log('Starting OT:', otId, 'User:', userId, 'Assigned intervenants:', assigned);
    if (!assigned.includes(userId)) throw new BadRequestException('User not assigned to this OT');

    return this.prisma.oTRequest.update({ where: { id: otId }, data: { status: 'IN_PROGRESS', startedAt: new Date(), startedById: userId } });
  }

  // Complete the OT: must be IN_PROGRESS
  async completeOT(otId: string, userId: string) {
    const ot = await this.prisma.oTRequest.findUnique({ where: { id: otId }, include: { intervenants: true } });
    if (!ot) throw new BadRequestException('OT not found');
    if (ot.status !== 'IN_PROGRESS') throw new BadRequestException('OT must be IN_PROGRESS to complete');

    const assigned = ot.intervenants.map(i => i.userId);
    if (!assigned.includes(userId)) throw new BadRequestException('User not assigned to this OT');

    return this.prisma.oTRequest.update({ where: { id: otId }, data: { status: 'CLOSED', closedAt: new Date(), closedById: userId } });
  }

  // Reject the OT with a reason: can be from OPEN or IN_PROGRESS
  async rejectOT(otId: string, userId: string, reason: string) {
    const ot = await this.prisma.oTRequest.findUnique({ where: { id: otId }, include: { intervenants: true } });
    if (!ot) throw new BadRequestException('OT not found');
    if (ot.status === 'CLOSED' || ot.status === 'REJECTED') throw new BadRequestException('OT already closed');

    // Optionally check user is assigned
    const assigned = ot.intervenants.map(i => i.userId);
    if (!assigned.includes(userId)) throw new BadRequestException('User not assigned to this OT');

    return this.prisma.oTRequest.update({ where: { id: otId }, data: { status: 'REJECTED', rejectionReason: reason, closedAt: new Date(), closedById: userId } });
  }

  // Admin: Get all OTs with optional filters
  async getAllOTs(filters: { status?: string; teamId?: string; userId?: string }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.creatorId = filters.userId;
    }

    if (filters.teamId) {
      where.creator = {
        teamId: filters.teamId,
      };
    }

    return this.prisma.oTRequest.findMany({
      where,
      include: {
        creator: { include: { team: true } },
        attachments: true,
        intervenants: { include: { user: true, assignedBy: true } },
        startedBy: true,
        closedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin: Get statistics dashboard
  async getAdminStats() {
    const total = await this.prisma.oTRequest.count();
    const open = await this.prisma.oTRequest.count({ where: { status: 'OPEN' } });
    const inProgress = await this.prisma.oTRequest.count({ where: { status: 'IN_PROGRESS' } });
    const closed = await this.prisma.oTRequest.count({ where: { status: 'CLOSED' } });
    const rejected = await this.prisma.oTRequest.count({ where: { status: 'REJECTED' } });

    // By team
    const teams = await this.prisma.team.findMany({
      include: {
        users: {
          include: {
            oTs: {
              select: { status: true },
            },
          },
        },
      },
    });

    const teamStats = teams.map(team => {
      const allOTs = team.users.flatMap(u => u.oTs);
      return {
        teamId: team.id,
        teamName: team.name,
        total: allOTs.length,
        open: allOTs.filter(o => o.status === 'OPEN').length,
        inProgress: allOTs.filter(o => o.status === 'IN_PROGRESS').length,
        closed: allOTs.filter(o => o.status === 'CLOSED').length,
        rejected: allOTs.filter(o => o.status === 'REJECTED').length,
      };
    });

    return {
      global: { total, open, inProgress, closed, rejected },
      byTeam: teamStats,
    };
  }

  // User: Get personal dashboard with stats
  async getUserDashboard(userId: string) {
    const created = await this.prisma.oTRequest.count({ where: { creatorId: userId } });
    const createdOpen = await this.prisma.oTRequest.count({
      where: { creatorId: userId, status: 'OPEN' },
    });
    const createdInProgress = await this.prisma.oTRequest.count({
      where: { creatorId: userId, status: 'IN_PROGRESS' },
    });
    const createdClosed = await this.prisma.oTRequest.count({
      where: { creatorId: userId, status: 'CLOSED' },
    });
    const createdRejected = await this.prisma.oTRequest.count({
      where: { creatorId: userId, status: 'REJECTED' },
    });

    const assigned = await this.prisma.oTRequest.count({
      where: {
        intervenants: {
          some: { userId },
        },
      },
    });

    const assignedInProgress = await this.prisma.oTRequest.count({
      where: {
        status: 'IN_PROGRESS',
        intervenants: {
          some: { userId },
        },
      },
    });

    const assignedClosed = await this.prisma.oTRequest.count({
      where: {
        status: 'CLOSED',
        intervenants: {
          some: { userId },
        },
      },
    });

    return {
      created: {
        total: created,
        open: createdOpen,
        inProgress: createdInProgress,
        closed: createdClosed,
        rejected: createdRejected,
      },
      assigned: {
        total: assigned,
        inProgress: assignedInProgress,
        closed: assignedClosed,
      },
    };
  }
}
