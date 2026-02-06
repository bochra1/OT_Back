import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { OTField, OTType } from '@prisma/client';

@Injectable()
export class OTTypeService {
//   constructor(private prisma: PrismaService) {}

//   // Create a new OT Type with fields
//   async createOTType(data: {
//     code: string;
//     label: string;
//     fields: Partial<OTField>[];
//   }): Promise<OTType & { fields: OTField[] }> {
//     return this.prisma.oTType.create({
//       data: {
//         code: data.code,
//         label: data.label,
//         fields: {
//           create: data.fields,
//         },
//       },
//       include: { fields: true },
//     });
//   }

//   async getAllOTTypes(): Promise<(OTType & { fields: OTField[] })[]> {
//     return this.prisma.oTType.findMany({ include: { fields: true } });
//   }

//   async getOTTypeById(id: string): Promise<OTType & { fields: OTField[] }> {
//     return this.prisma.oTType.findUnique({
//       where: { id },
//       include: { fields: true },
//     });
//   }
// async getOTTypeByRole(role: string) {
//   // Example mapping role → OT Type code
//   const roleToOTType = {
//     DATA: 'DATA',
//     IP: 'IP',
//     CC: 'CC_Data',
//   };
//   const otTypeCode = roleToOTType[role];
//   console.debug('Fetching OT Type for role:', role, 'with code:', otTypeCode, this.prisma.oTType.findUnique({
//     where: { code: otTypeCode },
//     include: { fields: true },
//   }));
//   return this.prisma.oTType.findUnique({
//     where: { code: otTypeCode },
//     include: { fields: true },
//   });
// }
}
