import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateOTRequestDto {
  @IsString()
  @IsNotEmpty()
  otTypeId: string;

  @IsObject()
  values: Record<string, any>;
}

export class UpdateOTRequestStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
