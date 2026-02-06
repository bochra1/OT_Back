// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import PrismaPkg from '@prisma/client';

// PrismaClient is a property of the default import in this setup
const PrismaClient = (PrismaPkg as any).PrismaClient;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super(); // no need for datasources here in v6
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✅ Prisma disconnected');
  }
}
