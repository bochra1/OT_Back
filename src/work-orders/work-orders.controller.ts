import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkOrdersService } from './work-orders.service';

// DTO (Data Transfer Object) for validation
export class CreateWorkOrderDto {
  title: string;
  workPlace?: string;
  action?: string;
  workDate?: Date;
  contactTT?: string;
  intervenant?: string;
  impact?: string;
  comment?: string;
  status: string;
  priotity?: string;
}

@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly service: WorkOrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateWorkOrderDto) {
    return this.service.create(dto);
  }
}
