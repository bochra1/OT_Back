import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import type { File as MulterFile } from 'multer';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  async uploadFiles(otId: string, files: MulterFile[]) {
    const ot = await this.prisma.oTRequest.findUnique({
      where: { id: otId },
    });

    if (!ot) throw new NotFoundException('OT not found');

    const year = new Date().getFullYear();
    const dir = `uploads/ot/${year}/${ot.lotNumber}`;
    fs.mkdirSync(dir, { recursive: true });

    const data: {
      otId: string;
      filename: string;
      filepath: string;
      mimetype: string;
      size: number;
    }[] = [];

    for (const file of files) {
      const finalPath = `${dir}/${file.originalname}`;
      fs.renameSync(file.path, finalPath);

      data.push({
        otId,
        filename: file.originalname,
        filepath: finalPath,
        mimetype: file.mimetype,
        size: file.size,
      });
    }

    await this.prisma.oTAttachment.createMany({ data });
    return { uploaded: data.length };
  }

  getAttachmentsByOT(otId: string) {
    return this.prisma.oTAttachment.findMany({
      where: { otId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async getAttachment(id: string) {
    const file = await this.prisma.oTAttachment.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async deleteAttachment(id: string) {
    const file = await this.prisma.oTAttachment.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File not found');

    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    await this.prisma.oTAttachment.delete({ where: { id } });
    return { deleted: true };
  }
}
