import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @ApiProperty()
  to: string;
  @IsBoolean()
  @ApiProperty()
  isWhatsapp: boolean;
  @IsString()
  @ApiProperty()
  text: string;
}
