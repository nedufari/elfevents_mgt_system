import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { Match } from "../../../helpers/match.decorator";

export class SuperAdminSignupDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsStrongPassword()
    @IsNotEmpty()
    password:string

    @IsString()
    @IsNotEmpty()
    name:string
}

export class AdminLoginDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsStrongPassword()
    @IsNotEmpty()
    password:string
}

export class RequestOtpResendDto {
    @IsEmail()
    email: string;
  }

  export class SendPasswordResetLinkDto{
    
    @IsString()
    @IsNotEmpty()
    email:string 

}

export class FinallyResetPasswordDto{
    
    @IsString()
    @IsNotEmpty()
    email:string 

    @IsString()
    @IsNotEmpty()
    resetlink:string 

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength:8,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1
    })
    password:string 

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Confirmation password does not match the new password.' })
    confirmPassword:string 

}

export class Logindto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

   
}



