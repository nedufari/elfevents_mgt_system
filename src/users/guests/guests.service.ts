import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestEntity } from '../../Entity/guests.entity';
import { GuestRepository, NotificationsRepository } from './guests.repository';
import { RegisterGuestsDto } from './guestDto/guest.dto';
import { Notifications } from '../../Entity/notifications.entity';
import { ComingAlongWithSomeone, GuestsStatus, NotificationType } from '../../Enums/enums';
import { customAlphabet } from 'nanoid';
import { Mailer } from '../../mailer/mailer.service';
import { IGuests } from './guests';
import { AdminRepository } from '../admin/admin.repository';
import { AdminEntity } from '../../Entity/admin.entity';

@Injectable()
export class GuestsService {
    constructor(@InjectRepository(GuestEntity) private guestripo: GuestRepository,
    @InjectRepository(Notifications) private notificationripo: NotificationsRepository,
    @InjectRepository(AdminEntity) private readonly adminripo: AdminRepository,
    private mailerservice:Mailer){}


    public generateAccessCode():string{
        const nanoid1 = customAlphabet('1234567890',6)
        return nanoid1()
      }

    //register guests 

    async RegisterGuests(dto:RegisterGuestsDto):Promise<{message:string}>{
        const verifyemail = await this.guestripo.findOne({where:{email:dto.email}})
        if(verifyemail) throw new HttpException('you are already on the guest list for this event',HttpStatus.FOUND)


        const guest = new GuestEntity()
        guest.email = dto.email
        guest.fullname = dto.fullname
        guest.phone = dto.phone
        guest.registration_date = new Date()
        guest.Isregistered = true
        guest.status = GuestsStatus.UNATTENDED_TO
        guest.access_code = this.generateAccessCode()

        guest.coming_with_any_other = dto.coming_with_any_other
        
        // If there is a company
    if (dto.coming_with_any_other === ComingAlongWithSomeone.YES) {

        // Check if both amount and names are provided
        if (!dto.amount || !dto.names) {
            throw new HttpException('The amount of the extra people coming and their names are required, please', HttpStatus.NOT_ACCEPTABLE)
        }
          // Check if the number of names does not exceed the amount
          if (dto.names.length > dto.amount) {
            throw new HttpException('The number of names cannot exceed the provided amount', HttpStatus.NOT_ACCEPTABLE)
        }

        // Check if the number of names is not less than the amount
        if (dto.names.length < dto.amount) {
            throw new HttpException('The number of names cannot be less than the provided amount', HttpStatus.NOT_ACCEPTABLE)
        }

        guest.amount = dto.amount
        guest.names = dto.names
    }


        await this.guestripo.save(guest)

        //forward the mail 
        await this.mailerservice.SendAccessCodeMail(guest.email,guest.access_code,guest.fullname,guest.event_title,guest.event_location,guest.event_time)
        
        //set notification 
        const notification = new Notifications()
        notification.account= guest.id
        notification.subject="New Guest registered!"
        notification.notification_type=NotificationType.GUEST_REGISTERED
        notification.message=` ${guest.fullname},  has successfully been added to the guest list`
        await this.notificationripo.save(notification)
  
        return {message:"new guest added to the guest list, please check your mail for the event invite "}
    
    }

    async getall():Promise<IGuests[]>{
        const findall = await this.guestripo.find()
        return findall
    }

}
