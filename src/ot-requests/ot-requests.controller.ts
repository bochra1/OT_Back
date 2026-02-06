import { Controller, Post, Get, Param, Body, Patch, Req, UseInterceptors, UploadedFiles, UseGuards, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CreateOTRequestDto, UpdateOTRequestStatusDto } from './dto/create-ot-request.dto';
import { OTRequestService } from './ot-requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import type { Multer } from 'multer';

@Controller('api/ot-requests')
export class OTRequestController {
  constructor(private otRequestService: OTRequestService, private prisma: PrismaService) {}

  @Get('seed/teams-and-users')
  async seedTeamsAndUsers() {
    // Create teams
    const teams = await Promise.all([
      this.prisma.team.upsert({
        where: { name: 'IP' },
        update: {},
        create: { name: 'IP' },
      }),
      this.prisma.team.upsert({
        where: { name: 'CC_DATA' },
        update: {},
        create: { name: 'CC_DATA' },
      }),
      this.prisma.team.upsert({
        where: { name: 'Core' },
        update: {},
        create: { name: 'Core' },
      }),
      this.prisma.team.upsert({
        where: { name: 'VAS' },
        update: {},
        create: { name: 'VAS' },
      }),
      this.prisma.team.upsert({
        where: { name: 'Mobile' },
        update: {},
        create: { name: 'Mobile' },
      }),
    ]);

    // Create users
    const usersData = [
      { name: 'Admin User', email: 'bochra.lbn@tt.com', role: 'ADMIN', teamName: 'IP' },
      { name: 'User IP 1', email: 'user.ip1@test.com', role: 'IP', teamName: 'IP' },
      { name: 'User IP 2', email: 'user.ip2@test.com', role: 'IP', teamName: 'IP' },
      { name: 'User CC_DATA 1', email: 'user.cc1@test.com', role: 'CC_DATA', teamName: 'CC_DATA' },
      { name: 'User CC_DATA 2', email: 'user.cc2@test.com', role: 'CC_DATA', teamName: 'CC_DATA' },
      { name: 'User Core 1', email: 'user.core1@test.com', role: 'Core', teamName: 'Core' },
      { name: 'User VAS 1', email: 'user.vas1@test.com', role: 'VAS', teamName: 'VAS' },
      { name: 'User Mobile 1', email: 'user.mobile1@test.com', role: 'Mobile', teamName: 'Mobile' },
    ];

    const users = await Promise.all(
      usersData.map(async (userData) => {
        const team = teams.find(t => t.name === userData.teamName);
        return this.prisma.user.upsert({
          where: { email: userData.email },
          update: {},
          create: {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            teamId: team?.id,
          },
        });
      }),
    );

    return { teams, users, message: 'Seed successful' };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments', maxCount: 10 }]))
  async createOT(@Req() req, @UploadedFiles() files: { attachments?: Multer.File[] }) {
    const userId = req.user.id;
    const role = req.user.role || 'IP';
    console.debug('Creating OT with userId:', userId, 'and role:', role);
    
    // Get form data from req.body and attach files
    const body = req.body;
    body.attachments = files?.attachments || [];
    
    return this.otRequestService.createOT(userId, role, body);
  }
  @Get('type/:otTypeId')
  @UseGuards(JwtAuthGuard)
  async getByType(@Param('otTypeId') otTypeId: string) {
    return this.otRequestService.getRequestsByType(otTypeId);
  }
  @Get('my-ots') //created by  user
  @UseGuards(JwtAuthGuard)
  async getUserOTs(@Req() req) {
    console.debug('Fetching OTs for user:', req.user);
    return this.otRequestService.getUserOTs(req.user.id);
  }

  @Get('assigned-to-me')
  @UseGuards(JwtAuthGuard)
  async getAssignedToMe(@Req() req) {
    return this.otRequestService.getAssignedToMe(req.user.id);
  }
  @Get('all-ots') //all by  user
  @UseGuards(JwtAuthGuard)
  async getAllMyOTs(@Req() req) {
    console.debug('Fetching all OTs for user:', req.user);
    return this.otRequestService.getAllMyOTs(req.user.id);
  }
  @Post(':id/assign')
  @UseGuards(JwtAuthGuard)
  async assignIntervenants(@Param('id') id: string, @Body() body: { intervenants: string[] }, @Req() req) {
    return this.otRequestService.assignIntervenants(id, body.intervenants || [], req.user.id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  async startOT(@Param('id') id: string, @Req() req) {
    return this.otRequestService.startOT(id, req.user.id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  async completeOT(@Param('id') id: string, @Req() req) {
    return this.otRequestService.completeOT(id, req.user.id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectOT(@Param('id') id: string, @Body() body: { reason: string }, @Req() req) {
    return this.otRequestService.rejectOT(id, req.user.id, body.reason);
  }

  @Get('teams/list')
  @UseGuards(JwtAuthGuard)
  async getTeams() {
    return this.prisma.team.findMany({
      include: {
        users: {
          select: { id: true, name: true, role: true, email: true },
        },
      },
    });
  }

  @Get('users/list')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, team: true },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return this.otRequestService.getRequestById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOTRequestStatusDto) {
    return this.otRequestService.updateStatus(id, dto.status);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAdminStats() {
    return this.otRequestService.getAdminStats();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllOTs(
    @Query('status') status?: string,
    @Query('teamId') teamId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.otRequestService.getAllOTs({ status, teamId, userId });
  }

  @Get('stats/my-dashboard')
  @UseGuards(JwtAuthGuard)
  async getMyDashboard(@Req() req) {
    return this.otRequestService.getUserDashboard(req.user.id);
  }
}
