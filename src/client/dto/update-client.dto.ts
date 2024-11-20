import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {}

export class UpdateClientBalanceDto {
  @IsNumber()
  @ApiProperty()
  balance: number;
}

export class UpdateCreditLimitDto {
  @IsNumber()
  @ApiProperty()
  creditLimit: number;
}

export class UpdateClientPlanDto {
  @IsString()
  @ApiProperty()
  plan: 'PREPAID' | 'POSTPAID';
}
