import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Client, Plan } from '@prisma/client';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessageService {
  private SMS_COST = 0.25;

  constructor(private prisma: PrismaService) {}

  async sendMessage(clientCpf: string, createMessageDto: CreateMessageDto) {
    const client = await this.prisma.client.findUnique({
      where: { cpf: clientCpf },
    });

    if (!client) throw new NotFoundException('Client not found');

    if (client.plan === Plan.PREPAID) await this.handlePrePaidClient(client);
    if (client.plan === Plan.POSTPAID) await this.handlePostPaidClient(client);

    return this.prisma.message.create({
      data: {
        clientId: client.id,
        to: createMessageDto.to,
        text: createMessageDto.text,
        isWhatsApp: createMessageDto.isWhatsapp,
      },
    });
  }

  private async handlePrePaidClient(client: Client) {
    if (client.balance < this.SMS_COST)
      throw new BadRequestException('Insufficient balance to send the massage');

    await this.prisma.client.update({
      where: { id: client.id },
      data: { balance: client.balance - this.SMS_COST },
    });
  }

  private async handlePostPaidClient(client: Client) {
    const totalConsumption = await this.prisma.consumption.aggregate({
      where: { clientId: client.id },
      _sum: { amount: true },
    });

    const usedLimit = totalConsumption._sum.amount || 0;
    if (usedLimit + this.SMS_COST > client.creditLimit) {
      throw new BadRequestException('Credit limit exceeded');
    }

    await this.prisma.consumption.create({
      data: {
        clientId: client.id,
        amount: this.SMS_COST,
      },
    });
  }
}
