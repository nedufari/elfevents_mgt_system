import { Body, Controller,Get,Param,Patch,Post,Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FinallyResetPasswordDto, Logindto, RequestOtpResendDto, SendPasswordResetLinkDto, SuperAdminSignupDto } from './dto/admin.dto';
import { CreateAdminDto } from './dto/adminAction.dto';
import { IAdmin, ICreateOtherAdmin } from './admin';
import { AdminActionService } from './adminActions.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly admiservice:AdminService,
        private readonly adminactionservice:AdminActionService){}

    @Post('/register')
    async Registeradmin(@Body()dto:SuperAdminSignupDto):Promise<{message:string}>{
        return await this.admiservice.createSuperAdmin(dto)
    }

    @Post('/verify-email')
    async Verify_email(@Query('token')token:string, @Query('email')email:string):Promise<{isValid:boolean; accessToken:any}>{
        return await this.admiservice.SuperAdminverifyEmail(token, email)
    }

    @Post('/resend-verification-link')
    async resendVerificationLink(@Body()dto:RequestOtpResendDto):Promise<{message:string}>{
        return await this.admiservice.AdminResendemailVerificationLink(dto)

    }

    @Post('/send-password-reset-link')
    async sendPasswordResetLink (@Body()dto:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.admiservice.AdminsendPasswordResetLink(dto)
    }

    @Patch('/reset-password')
    async ResetPassword(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.admiservice.AdminfinallyResetPassword(dto)

    }

    @Post('/login')
    async Login(@Body()dto:Logindto){
        return await this.admiservice.loginAdmin(dto)
    }

   

}
