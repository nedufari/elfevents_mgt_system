import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './users/admin/admin.module';
import { GuestsModule } from './users/guests/guests.module';
import { AuthModule } from './auth/auth.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormService } from './typeorm/typeorm.service';
import { MailerModule } from '@nestjs-modules/mailer';
import {  Mailer } from './mailer/mailer.service';

@Module({
  imports: [
    AdminModule,
    GuestsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({useClass:TypeormService}),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport:{
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
          user:process.env.AUTH_EMAIL,
          pass:process.env.AUTH_Pass
        }
      }
    })
    
  ],
  controllers: [AppController],
  providers: [AppService, Mailer],
  exports: [Mailer]
})
export class AppModule {}
