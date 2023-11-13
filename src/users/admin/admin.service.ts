import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../../Entity/admin.entity';
import { AdminRepository } from './admin.repository';
import { FinallyResetPasswordDto, Logindto, RequestOtpResendDto, SendPasswordResetLinkDto, SuperAdminSignupDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';
import { AccessLevels, NotificationType, Roles } from '../../Enums/enums';
import { Notifications } from '../../Entity/notifications.entity';
import {
  NotificationsRepository,
  UserOtpRepository,
} from '../guests/guests.repository';
import { UserOtp } from '../../Entity/otp.entity';
import { Mailer } from '../../mailer/mailer.service';
import { GuestsService } from '../guests/guests.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminripo: AdminRepository,
    @InjectRepository(Notifications)
    private readonly notificationripo: NotificationsRepository,
    @InjectRepository(UserOtp) private readonly otpripo: UserOtpRepository,
    private mailerservice:Mailer,
    private guestservice:GuestsService,
    private configservice:ConfigService,
    private jwt: JwtService,
  ) {}

  async hashpassword(password): Promise<string> {
    return await bcrypt.hash(password,12);
  }

  public async comaprePassword(userpassword, dbpassword): Promise<boolean> {
    return await bcrypt.compare(userpassword, dbpassword);
  }

//for jwt validation purpose 
async validateuserbyId(id:string,role:Roles){
  const user = await this.adminripo.findOne({where:{id:id, role:role}})
  return user
}

  async createSuperAdmin(
    dto: SuperAdminSignupDto,
  ): Promise<{ message: string }> {
    const checkemail = await this.adminripo.findOne({
      where: { email: dto.email },
    });
    if (checkemail)
      throw new HttpException(
        'this super admin already exists',
        HttpStatus.FOUND,
      );

    const hashedpassword = await this.hashpassword(dto.password);

    const admin = new AdminEntity();
    admin.email = dto.email;
    admin.password = hashedpassword;
    admin.name = dto.name
    admin.accesslevel = AccessLevels.HIGHEST_LEVEL;
    admin.role = Roles.SUPER_ADMIN;
    admin.created_at = new Date();
    await this.adminripo.save(admin);

    //2fa authentication 
    const emiailverificationcode =  await this.guestservice.generateAccessCode()
    const verificationlink = `http://localhost:3005/api/v1/admin/verify-email?token=${emiailverificationcode}&email=${dto.email} `
   
     // mail
     await this.mailerservice.SendVerificationMail(dto.email, verificationlink,dto.name)

    //otp
    const otp = new UserOtp();
    otp.email = dto.email;
    otp.otp = emiailverificationcode;
    otp.role = admin.role;
    const fiveminuteslater = new Date();
    await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes() + 10);
    otp.expiration_time = fiveminuteslater;
    await this.otpripo.save(otp);

   

    //save the notification
    const notification = new Notifications();
    notification.account = admin.id;
    notification.subject = 'New Super Admin!';
    notification.notification_type = NotificationType.SUPER_ADMIN_CREATED;
    notification.message = `new super admin created successfully `;
    await this.notificationripo.save(notification);

    return {
      message:
        'you have successfully registered as a super admin, please check your mail for the otp verification',
    };
  }

       //(verify otp)

       async SuperAdminverifyEmail(token:string, email:string):Promise<{isValid:boolean; accessToken:any}>{
        const findemail= await this.otpripo.findOne({where:{email:email}})
        if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
        //find the otp privided if it matches with the otp stored 
        const findotp= await this.otpripo.findOne({where:{otp:token}})
        if (!findotp) throw new HttpException('you provided an invalid otp,please go back to your mail and confirm the OTP sent to you', HttpStatus.BAD_REQUEST)
        
        //find if the otp is expired 
        if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)
    
        //return valid and the access token if the user matches 
    
        const admin = await this.adminripo.findOne({where:{email:email}})
        if (admin.email !== findemail.email) throw new HttpException("this email does not match the customer record we have ", HttpStatus.NOT_FOUND)
        else{
         
          admin.Isverfified=true
          admin.Islogged_in=true
          admin.Isregistered =true
        
    
         const notification = new Notifications()
          notification.account= admin.id,
          notification.subject="Super Admin Verified!"
          notification.notification_type=NotificationType.EMAIL_VERIFICATION
          notification.message=`Hello ${admin.name}, your email has been successfully verified `
          await this.notificationripo.save(notification)
    
          //await this.mailerservice.SendWelcomeEmail(admin.email,admin.brandname)
    
          await this.adminripo.save(admin)
    
          const accessToken= await this.signToken(admin.id,admin.email,admin.role)

          return {isValid:true, accessToken}
        }
      }

       //(resend otp)

       async AdminResendemailVerificationLink (dto:RequestOtpResendDto):Promise<{message:string}>{
        const emailexsist = await this.adminripo.findOne({where: { email: dto.email },select: ['id', 'email','role']});
          if (!emailexsist)
            throw new HttpException(
              `user with email: ${dto.email} exists, please use another unique email`,
              HttpStatus.CONFLICT,
            );
         // Generate a new OTP
         const emiailverificationcode= await this.guestservice.generateAccessCode() // Your OTP generated tokens
         const verificationlink = `http://localhost:3005/api/v1/waitlist/vendor/verify-otp?token=${emiailverificationcode}&email=${dto.email} `
    
         // Save the token with expiration time
         const fiveminuteslater=new Date()
         await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+10)

        //save the token
         const newOtp = this.otpripo.create({ 
          email:dto.email, 
          otp:emiailverificationcode, 
          expiration_time: fiveminuteslater,
          role: emailexsist.role
        });
         await this.otpripo.save(newOtp);
    
         //save the notification 
         const notification = new Notifications()
         notification.account= emailexsist.id
         notification.subject="New Customer!"
         notification.notification_type=NotificationType.EMAIL_VERIFICATION
         notification.message=`Hello ${emailexsist.name}, a new verification Link has been sent to your mail `
         await this.notificationripo.save(notification)
     
         
           //send mail 
           await this.mailerservice.SendVerificationMail(newOtp.email,verificationlink, emailexsist.name)
    
           return {message:'New Verification Link sent successfully'}
           
       }

//reset password
       
  async AdminsendPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
    const isEmailReistered= await this.adminripo.findOne({where:{email:dto.email}})
    if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in walkway, please try another email address`,HttpStatus.NOT_FOUND)

    const resetlink= await this.guestservice.generateAccessCode()
    const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

    //send reset link to the email provided 
    await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink)

    //save the reset link and the expiration time to the database 
    isEmailReistered.password_reset_link = resetlink
    isEmailReistered.reset_link_exptime = expirationTime
    await this.adminripo.save(isEmailReistered)

    const notification = new Notifications()
    notification.account= isEmailReistered.id,
    notification.subject="password Reset link!"
    notification.notification_type=NotificationType.EMAIL_VERIFICATION
    notification.message=`Hello ${isEmailReistered.name}, password resent link sent `
    await this.notificationripo.save(notification)



    return {message:"the password reset link has been sent successfully"}
    
  }

  async AdminfinallyResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
    const verifyuser= await this.adminripo.findOne({where:{email:dto.email}})
    if (!verifyuser) throw new HttpException('this user is not registered with elfevents',HttpStatus.NOT_FOUND)

    //compare token 
    if (verifyuser.password_reset_link !== dto.resetlink) throw new HttpException('the link is incorrect please retry or request for another link',HttpStatus.NOT_ACCEPTABLE)

    //take new password 
    const newpassword= await this.hashpassword(dto.password)
    verifyuser.password=newpassword

    await this.adminripo.save(verifyuser)

    const notification = new Notifications()
    notification.account= verifyuser.id,
    notification.subject="New Customer!"
    notification.notification_type=NotificationType.EMAIL_VERIFICATION
    notification.message=`Hello ${verifyuser.name}, password reset link verified and the password has been recently reseted `
    await this.notificationripo.save(notification)


    return {message:"your password has been reset susscessfully"}
  }





//access token 
  
  async signToken(id: string, email: string,role:string) {
    const payload = {
      sub: id,
      email,
      role
    };
    const secret = this.configservice.get('SECRETKEY');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.configservice.get('EXPIRESIN'),
      secret: secret,
    });
    return { accesstoken: token };
  }


  //login admin 

  async loginAdmin(logindto:Logindto){
    const findadmin= await this.adminripo.findOne({where:{email:logindto.email}})
    if (!findadmin) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findadmin.password)
    if (!comparepass) {
      findadmin.login_count+=1;

      if (findadmin.login_count>=5){
        findadmin.is_locked=true
        findadmin.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.adminripo.save(findadmin)
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findadmin.login_count
    await this.adminripo.save(findadmin)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

    if (!findadmin.Isverfified) {
      // If the account is not verified, throw an exception
      throw new ForbiddenException(
        `Your account has not been verified. Please verify your account by requesting a verification link.`
      );
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findadmin.login_count = 0;
    findadmin.Islogged_in = true;
    await this.adminripo.save(findadmin)

    //save the notification 
    const notification = new Notifications()
    notification.account= findadmin.id
    notification.subject="Photographer just logged in!"
    notification.notification_type=NotificationType.OTHER_ADMIN_LOGGED_IN
    notification.message=`Hello ${findadmin.name}, just logged in `
    await this.notificationripo.save(notification)

    return await this.signToken(findadmin.id,findadmin.email,findadmin.role)

  }
    
}
