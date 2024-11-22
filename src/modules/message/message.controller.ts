import { Controller, Post, Body, Param } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @Post(':cpf/send-message')
  async sendMessage(
    @Param('cpf') cpf: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.sendMessage(cpf, createMessageDto);
  }
}
