import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm"
import { AdminEntity } from '../Entity/admin.entity';
import { GuestEntity } from '../Entity/guests.entity';
import { UserOtp } from '../Entity/otp.entity';
import { Notifications } from '../Entity/notifications.entity';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory{
    constructor(private configservice:ConfigService){}

    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return{
            type:'postgres',
            host:this.configservice.get('DATABASE_HOST'),
            port:this.configservice.get('DATABASE_PORT'),
            username:this.configservice.get('DATABASE_USERNAME'),
            password:String(this.configservice.get('DATABASE_PASSWORD')),
            database:this.configservice.get('DATABASE_NAME'),
            synchronize:true,
            logging:false,
            entities:[AdminEntity, GuestEntity,UserOtp, Notifications],
            migrations:[],
            subscribers:[]
        }
    }

}
