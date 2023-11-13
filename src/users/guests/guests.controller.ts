import { Body, Controller, Get, Post } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { RegisterGuestsDto } from './guestDto/guest.dto';
import { IGuests } from './guests';

@Controller('guests')
export class GuestsController {
    constructor(private readonly guestservice:GuestsService){}

    @Post('/register')
    async RegisterGuest(@Body()dto:RegisterGuestsDto):Promise<{message:string}>{
        return await this.guestservice.RegisterGuests(dto)
    }

    @Get('all')
    async getallguests():Promise<IGuests[]>{
        return await this.guestservice.getall()
    }

}
