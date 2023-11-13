import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestEntity } from '../../Entity/guests.entity';
import { Notifications } from '../../Entity/notifications.entity';
import { Mailer } from '../../mailer/mailer.service';

@Module({
  imports :[TypeOrmModule.forFeature([Notifications,GuestEntity])],
  controllers: [GuestsController],
  providers: [GuestsService,Mailer]
})
export class GuestsModule {}
