import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { MessageModule } from './modules/message/message.module';
import { JwtModule } from '@nestjs/jwt';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ClientModule,
    MessageModule,
    JwtModule.register({
      global: true,
      secret: 'super_secret_key',
      signOptions: { expiresIn: '12h' },
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
