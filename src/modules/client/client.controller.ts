import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './services/client.service';
import {
  UpdateClientBalanceDto,
  UpdateClientPlanDto,
  UpdateCreditLimitDto,
} from './dto/update-client.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { Public } from 'common/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'common/guards/is-admin.guard';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Post('register')
  async registerClient(@Body() createUserDto: CreateClientDto) {
    return this.clientService.registerClient(createUserDto);
  }

  @Public()
  @Post('login')
  async loginClient(@Body() loginUserDto: LoginClientDto) {
    return this.clientService.loginClient(loginUserDto);
  }

  @UseGuards(IsAdminGuard)
  @Patch(':cpf/add-credits')
  async addCredits(
    @Param('cpf') cpf: string,
    @Body() updateClientAmountDto: UpdateClientBalanceDto,
  ) {
    return this.clientService.addCredits(cpf, updateClientAmountDto.balance);
  }

  @UseGuards(IsAdminGuard)
  @Get(':cpf/balance')
  async getBalance(@Param('cpf') cpf: string) {
    return this.clientService.getBalance(cpf);
  }

  @UseGuards(IsAdminGuard)
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

  @UseGuards(IsAdminGuard)
  @Patch(':cpf/change-plan')
  async changePlan(
    @Param('cpf') cpf: string,
    @Body() newPlan: UpdateClientPlanDto,
  ) {
    return this.clientService.changePlan(cpf, newPlan.plan);
  }

  @UseGuards(IsAdminGuard)
  @Get(':cpf/details')
  async getClientDetails(@Param('cpf') cpf: string) {
    return this.clientService.getClientDetails(cpf);
  }
}
