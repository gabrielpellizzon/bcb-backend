import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { Plan, Service } from '@prisma/client';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessageService {
  private SMS_COST = 0.25;

  constructor(private prisma: PrismaService) {}

  async sendMessage(clientCpf: string, createMessageDto: CreateMessageDto) {
    const client = await this.prisma.client.findUnique({
      where: { cpf: clientCpf },
      include: { services: true },
    });

    if (!client) throw new NotFoundException('Client not found');

    const service = client.services[0];

    if (!service)
      throw new BadRequestException('No service associated with this client');

    if (service.plan === Plan.PREPAID) await this.handlePrePaidClient(service);
    if (service.plan === Plan.POSTPAID)
      await this.handlePostPaidClient(service);

    return this.prisma.message.create({
      data: {
        clientId: client.id,
        to: createMessageDto.to,
        text: createMessageDto.text,
        isWhatsApp: createMessageDto.isWhatsapp,
      },
    });
  }

  private async handlePrePaidClient(service: Service) {
    if (service.balance < this.SMS_COST)
      throw new BadRequestException('Insufficient balance to send the massage');

    await this.prisma.service.update({
      where: { id: service.id },
      data: { balance: service.balance - this.SMS_COST },
    });
  }

  private async handlePostPaidClient(service: Service) {
    const totalConsumption = await this.prisma.consumption.aggregate({
      where: { clientId: service.clientId },
      _sum: { amount: true },
    });

    const usedLimit = totalConsumption._sum.amount || 0;

    if (usedLimit + this.SMS_COST > service.creditLimit) {
      throw new BadRequestException('Credit limit exceeded');
    }

    await this.prisma.consumption.create({
      data: {
        clientId: service.clientId,
        amount: this.SMS_COST,
      },
    });
  }
}
