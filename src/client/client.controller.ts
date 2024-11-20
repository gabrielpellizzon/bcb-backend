import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { Plan } from '@prisma/client';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Patch(':cpf/add-credits')
  async addCredits(@Param('cpf') cpf: string, @Body('amount') amount: number) {
    return this.clientService.addCredits(cpf, amount);
  }

  @Get(':cpf/balance')
  async getBalance(@Param('cpf') cpf: string) {
    return this.clientService.getBalance(cpf);
  }

  @Patch(':cpf/update-credit-limit')
  async updateCreditLimit(
    @Param('cpf') cpf: string,
    @Body('newLimit') newLimit: number,
  ) {
    return this.clientService.updateCreditLimit(cpf, newLimit);
  }

  @Patch(':cpf/change-plan')
  async changePlan(@Param('cpf') cpf: string, @Body('newPlan') newPlan: Plan) {
    return this.clientService.changePlan(cpf, newPlan);
  }

  @Get(':cpf/details')
  async getClientDetails(@Param('cpf') cpf: string) {
    return this.clientService.getClientDetails(cpf);
  }
}
