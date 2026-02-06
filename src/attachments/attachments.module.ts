import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, PrismaService],
})
export class AttachmentsModule {}
