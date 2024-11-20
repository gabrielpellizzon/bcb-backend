import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plan } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async addCredits(cpf: string, amount: number) {
    const client = await this.prisma.client.findUnique({ where: { cpf } });

    if (!client) throw new NotFoundException('Client not found');
    if (client.plan !== Plan.PREPAID)
      throw new BadRequestException(
        'Only prepaid client can have credits added',
      );

    return this.prisma.client.update({
      where: { cpf },
      data: { balance: client.balance + amount },
    });
  }

  async getBalance(cpf: string) {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
      select: { balance: true },
    });

    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async updateCreditLimit(cpf: string, newLimit: number) {
    const client = await this.prisma.client.findUnique({ where: { cpf } });

    if (!client) throw new NotFoundException('Client not found');
    if (client.plan !== Plan.POSTPAID)
      throw new BadRequestException(
        'Only postpaid client can have a credit limit',
      );

    return this.prisma.client.update({
      where: { cpf },
      data: { creditLimit: newLimit },
    });
  }

  async changePlan(cpf: string, newPlan: Plan) {
    const client = await this.prisma.client.findUnique({ where: { cpf } });

    if (!client) throw new NotFoundException('Client not found');

    const updatedData = {
      plan: newPlan,
      balance: newPlan === Plan.PREPAID ? 0 : null,
      creditLimit: newPlan === Plan.POSTPAID ? 100 : null,
    };

    return this.prisma.client.update({
      where: { cpf },
      data: updatedData,
    });
  }

  async getClientDetails(cpf: string) {
    return this.prisma.client.findUnique({ where: { cpf } });
  }
}
