import { IsBoolean, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  to: string;
  @IsBoolean()
  isWhatsapp: boolean;
  @IsString()
  text: string;
}
