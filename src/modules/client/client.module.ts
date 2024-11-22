import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientController } from './client.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
