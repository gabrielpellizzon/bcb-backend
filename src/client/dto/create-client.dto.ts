import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  phone: string;
  @IsString()
  cpf: string;
  @IsString()
  cnpj: string;
  @IsString()
  companyName: string;
  @IsString()
  plan: 'PREPAID' | 'POSTPAID';
  @IsOptional()
  @IsNumber()
  balance?: number;
  @IsOptional()
  @IsNumber()
  creditLimit?: number;
}
