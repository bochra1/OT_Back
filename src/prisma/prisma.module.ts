import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // pour ne pas avoir besoin de réimporter ce module partout
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
