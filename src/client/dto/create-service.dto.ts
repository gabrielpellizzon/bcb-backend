import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Plan } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsEnum(Plan)
  @ApiProperty()
  plan: Plan;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  balance?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  creditLimit?: number;
}
