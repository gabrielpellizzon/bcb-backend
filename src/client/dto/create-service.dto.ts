import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Plan } from '@prisma/client';

export class CreateServiceDto {
  @IsEnum(Plan)
  plan: Plan;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;
}
