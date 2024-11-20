import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
