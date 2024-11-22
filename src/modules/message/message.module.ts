import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageController } from './message.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
