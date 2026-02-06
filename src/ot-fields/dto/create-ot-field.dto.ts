// import { FieldType } from '@prisma/client';
// import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, IsInt } from 'class-validator';

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

// export class UpdateOTFieldDto {
//   @IsString()
//   @IsOptional()
//   name?: string;

//   @IsString()
//   @IsOptional()
//   label?: string;

//   @IsOptional()
//   type?: FieldType;

//   @IsBoolean()
//   @IsOptional()
//   required?: boolean;

//   @IsArray()
//   @IsOptional()
//   options?: any[];

//   @IsInt()
//   @IsOptional()
//   order?: number;
// }
