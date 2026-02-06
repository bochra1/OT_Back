// import { FieldType } from '@prisma/client';
// import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsInt } from 'class-validator';

// export class CreateOTFieldDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   label: string;

//   type: FieldType;

//   @IsBoolean()
//   @IsOptional()
//   required?: boolean;

//   @IsArray()
//   @IsOptional()
//   options?: any[];

//   @IsInt()
//   order: number;
// }

// export class CreateOTTypeDto {
//   @IsString()
//   @IsNotEmpty()
//   code: string;

//   @IsString()
//   @IsNotEmpty()
//   label: string;

//   @IsArray()
//   fields: CreateOTFieldDto[];
// }
