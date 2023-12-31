import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { AccessLevels, Accreditation, AdminTypes, GuestType } from "../../../Enums/enums"

//create admin dto 
export class CreateAdminDto{
    @IsEnum(AdminTypes)
    @IsNotEmpty()
    admintype:AdminTypes

    @IsEnum(AccessLevels)
    @IsNotEmpty()
    accessLevel:AccessLevels

    @IsEmail()
    @IsNotEmpty({})
    email:string

    @IsString()
    @IsNotEmpty()
    name:string
}

export class UpgradeClearanceLevelDto{
    @IsEnum(AccessLevels)
    @IsNotEmpty()
    accessLevel:AccessLevels

}

export class ChangeAdmintypeDto{
    @IsEnum(AdminTypes)
    @IsNotEmpty()
    admintype:AdminTypes
}

export class AccreditationDto{
    @IsEnum(Accreditation)
    accreditate:Accreditation
}

export class distinguishGuestsDto{
    @IsEnum(GuestType)
    distinguish : GuestType
}

export class PrepareSystemDto{
   

    @IsString()
    @IsNotEmpty()
    event_location:string

    @IsString()
    @IsNotEmpty()
    event_time:string

    @IsString()
    @IsNotEmpty()
    event_title:string
}
    
