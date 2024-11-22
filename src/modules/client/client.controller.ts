import { Controller, Get, Body, Patch, Param, Post } from '@nestjs/common';
import { ClientService } from './services/client.service';
import {
  UpdateClientBalanceDto,
  UpdateClientPlanDto,
  UpdateCreditLimitDto,
} from './dto/update-client.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginClientDto } from './dto/login-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  async registerClient(@Body() createUserDto: CreateClientDto) {
    return this.clientService.registerClient(createUserDto);
  }

  @Post('login')
  async loginClient(@Body() loginUserDto: LoginClientDto) {
    return this.clientService.loginClient(loginUserDto);
  }

  @Patch(':cpf/add-credits')
  async addCredits(
    @Param('cpf') cpf: string,
    @Body() updateClientAmountDto: UpdateClientBalanceDto,
  ) {
    return this.clientService.addCredits(cpf, updateClientAmountDto.balance);
  }

  @Get(':cpf/balance')
  async getBalance(@Param('cpf') cpf: string) {
    return this.clientService.getBalance(cpf);
  }

  @Patch(':cpf/credit-limit')
  async updateCreditLimit(
    @Param('cpf') cpf: string,
    @Body() updateCreditLimitDto: UpdateCreditLimitDto,
  ) {
    return this.clientService.updateCreditLimit(
      cpf,
      updateCreditLimitDto.creditLimit,
    );
  }

  @Patch(':cpf/change-plan')
  async changePlan(
    @Param('cpf') cpf: string,
    @Body() newPlan: UpdateClientPlanDto,
  ) {
    return this.clientService.changePlan(cpf, newPlan.plan);
  }

  @Get(':cpf/details')
  async getClientDetails(@Param('cpf') cpf: string) {
    return this.clientService.getClientDetails(cpf);
  }
}