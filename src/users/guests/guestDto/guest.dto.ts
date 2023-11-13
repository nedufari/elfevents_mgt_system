import { IsString,IsNotEmpty, IsEmail, IsOptional,MaxLength, IsEnum } from "class-validator";
import { ComingAlongWithSomeone } from "../../../Enums/enums";

export class RegisterGuestsDto{
    @IsString()
    @IsNotEmpty({message:"you must provide your fullname "})
    fullname:string

    @IsString()
    @IsNotEmpty()
    @MaxLength(11)
    phone:string

    @IsEmail()
    @IsNotEmpty({message:"you must provide a valid email address "})
    email:string

    @IsEnum(ComingAlongWithSomeone)
    @IsNotEmpty({message:"you must provide this information to avaoid any form of embarassment at the event center "})
    coming_with_any_other:ComingAlongWithSomeone

    names:string[]
    amount:number

}

export class UpdateGuestsDto{
    @IsString()
    @IsOptional()
    fullname:string

    @IsEmail()
    @IsOptional()
    email:string

    coming_with_any_other:boolean
    names:string[]
    amount:string

}