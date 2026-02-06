import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { OTRequestModule } from './ot-requests/ot-requests.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [AuthModule, WorkOrdersModule,  OTRequestModule, AttachmentsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
