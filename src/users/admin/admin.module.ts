import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../../Entity/admin.entity';
import { UserOtp } from '../../Entity/otp.entity';
import { Notifications } from '../../Entity/notifications.entity';
import { GuestsService } from '../guests/guests.service';
import { Mailer } from '../../mailer/mailer.service';
import { GuestEntity } from '../../Entity/guests.entity';
import { JwtService } from '@nestjs/jwt';
import { AdminActionService } from './adminActions.service';
import { AdminActionController } from './adminActions.controller';

@Module({
  imports:[TypeOrmModule.forFeature([AdminEntity,UserOtp,Notifications,GuestEntity])],
  controllers: [AdminController,AdminActionController],
  providers: [ AdminService,GuestsService,Mailer,JwtService,AdminActionService],
  exports:[AdminService]
})
export class AdminModule {}
