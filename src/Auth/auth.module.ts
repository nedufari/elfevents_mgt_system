import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { AccessLevelGuard, AdmintypeGuard } from './guards/role.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminService } from '../users/admin/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../Entity/admin.entity';
import { Notifications } from '../Entity/notifications.entity';
import { UserOtp } from '../Entity/otp.entity';
import { GuestEntity } from '../Entity/guests.entity';
import { Mailer } from '../mailer/mailer.service';
import { GuestsService } from '../users/guests/guests.service';

@Module({
  providers:[JwtGuard,AdmintypeGuard,AccessLevelGuard,JwtStrategy,AdminService,Mailer,GuestsService],
  imports:[  TypeOrmModule.forFeature([AdminEntity,Notifications,UserOtp,GuestEntity]),
    JwtModule.registerAsync({
    useFactory:()=>({
        secret:process.env.SECRETKEY,
        signOptions:{expiresIn:process.env.EXPIRESIN}
        
    })
})]
})
export class AuthModule {}
