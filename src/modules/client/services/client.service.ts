import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { Plan } from '@prisma/client';
import { CreateClientDto } from '../dto/create-client.dto';
import * as bcrypt from 'bcrypt';
import { LoginClientDto } from '../dto/login-client.dto';
import { ClientPayload } from '../interfaces/clients-login.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClientService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerClient(createClientDto: CreateClientDto) {
    const { email, cpf, cnpj, password, services, ...otherDetails } =
      createClientDto;

    const existingClient = await this.prisma.client.findFirst({
      where: {
        OR: [{ email }, { cpf }, { cnpj }],
      },
    });

    if (existingClient)
      throw new ConflictException('Email, CPF or CNPJ alterady in use');

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const newClient = await this.prisma.client.create({
      data: {
        ...otherDetails,
        email,
        cpf,
        cnpj,
        password: hashedPassword,
        services: services
          ? {
              create: {
                plan: services.plan,
                balance: services.balance || 0.0,
                creditLimit: services.creditLimit,
              },
            }
          : undefined,
      },
      include: { services: true },
    });

    delete newClient.password;

    return newClient;
  }

  async loginClient(loginClientDto: LoginClientDto) {
    const client = await this.prisma.client.findUnique({
      where: { email: loginClientDto.email },
    });

    if (!client) throw new NotFoundException('Client not found');

    if (!(await bcrypt.compare(loginClientDto.password, client.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: ClientPayload = {
      sub: client.id,
      email: client.email,
      name: client.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

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
    const client = await this.prisma.client.findUnique({
      where: { cpf },
      include: { services: true },
    });

    delete client.password;

    return client;
  }
}
