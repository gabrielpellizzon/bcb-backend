import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plan } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async addCredits(cpf: string, amount: number) {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
      include: { services: true },
    });

    if (!client) throw new NotFoundException('Client not found');

    const service = client.services.find(
      (service) => service.plan === Plan.PREPAID,
    );

    if (!service)
      throw new BadRequestException(
        'Only prepaid client can have credits added',
      );

    return this.prisma.service.update({
      where: { id: service.id },
      data: { balance: service.balance + amount },
    });
  }

  async getBalance(cpf: string) {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
      select: { name: true, services: true },
    });

    if (!client) throw new NotFoundException('Client not found');

    const prepaidService = client.services.find(
      (service) => service.plan === Plan.PREPAID,
    );
    return {
      name: client.name,
      balance: prepaidService ? prepaidService.balance : 0,
    };
  }

  async updateCreditLimit(cpf: string, newLimit: number) {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
      include: { services: true },
    });

    if (!client) throw new NotFoundException('Client not found');

    const service = client.services.find(
      (service) => service.plan === Plan.POSTPAID,
    );

    if (!service)
      throw new BadRequestException(
        'Only postpaid client can have a credit limit',
      );

    return this.prisma.service.update({
      where: { id: service.id },
      data: { creditLimit: newLimit },
    });
  }

  async changePlan(cpf: string, newPlan: Plan) {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
      include: { services: true },
    });

    if (!client) throw new NotFoundException('Client not found');

    const currentService = client.services.find(
      (service) => service.plan === newPlan,
    );

    if (currentService)
      throw new ConflictException(`Client is already a ${newPlan} client`);

    const updatedData = {
      plan: newPlan,
      balance: 0,
      creditLimit: newPlan === Plan.POSTPAID ? 100 : null,
    };

    const existingService = client.services[0];

    if (existingService) {
      return this.prisma.service.update({
        where: { id: existingService.id },
        data: updatedData,
      });
    }

    return this.prisma.service.create({
      data: {
        clientId: client.id,
        ...updatedData,
      },
    });
  }

  async getClientDetails(cpf: string) {
    return this.prisma.client.findUnique({
      where: { cpf },
      include: { services: true },
    });
  }
}
