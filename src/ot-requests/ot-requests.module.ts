import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OTRequestService } from './ot-requests.service';
import { OTRequestController } from './ot-requests.controller';

@Module({
  providers: [OTRequestService, PrismaService],
  controllers: [OTRequestController],
})
export class OTRequestModule {}
