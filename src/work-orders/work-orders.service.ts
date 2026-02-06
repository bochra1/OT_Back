import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkOrdersService {
//      private workOrders = [
//     { id: 1, title: "Maintenance AC", status: "Open" },
//     { id: 2, title: "Replace filters", status: "Completed" },
//   ];
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.workOrder.findMany();
  }
    async create(data: any) {
    return this.prisma.workOrder.create({ data });
  }
}
