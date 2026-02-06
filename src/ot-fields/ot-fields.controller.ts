// import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
// import { CreateOTFieldDto, UpdateOTFieldDto } from './dto/create-ot-field.dto';
// import { OTFieldService } from './ot-fields.service';

// @Controller('ot-fields')
// export class OTFieldController {
//   constructor(private otFieldService: OTFieldService) {}

//   @Post(':otTypeId')
//   async createFields(@Param('otTypeId') otTypeId: string, @Body() fields: CreateOTFieldDto[]) {
//     return this.otFieldService.createFields(otTypeId, fields);
//   }

//   @Get(':otTypeId')
//   async getFields(@Param('otTypeId') otTypeId: string) {
//     return this.otFieldService.getFieldsByType(otTypeId);
//   }

//   @Patch(':fieldId')
//   async updateField(@Param('fieldId') fieldId: string, @Body() dto: UpdateOTFieldDto) {
//     return this.otFieldService.updateField(fieldId, dto);
//   }

//   @Delete(':fieldId')
//   async deleteField(@Param('fieldId') fieldId: string) {
//     return this.otFieldService.deleteField(fieldId);
//   }
// }
