// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { OTField } from '@prisma/client';

// @Injectable()
// export class OTFieldService {
//   constructor(private prisma: PrismaService) {}

//   // Create one or multiple fields for a type
//   async createFields(
//     otTypeId: string,
//     fields: Partial<OTField>[],
//   ): Promise<OTField[]> {
//     return this.prisma.oTField.createMany({
//       data: fields.map(f => ({
//         ...f,
//         otTypeId,
//       })),
//     }).then(() => this.getFieldsByType(otTypeId));
//   }

//   // Get fields for a given OT type
//   async getFieldsByType(otTypeId: string): Promise<OTField[]> {
//     return this.prisma.oTField.findMany({
//       where: { otTypeId },
//       orderBy: { order: 'asc' },
//     });
//   }

//   // Update a field
//   async updateField(fieldId: string, data: Partial<OTField>): Promise<OTField> {
//     return this.prisma.oTField.update({
//       where: { id: fieldId },
//       data,
//     });
//   }

//   // Delete a field
//   async deleteField(fieldId: string): Promise<OTField> {
//     return this.prisma.oTField.delete({
//       where: { id: fieldId },
//     });
//   }
// }
