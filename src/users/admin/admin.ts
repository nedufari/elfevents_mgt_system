import { AccessLevels, AdminTypes, GuestType, Roles } from "../../Enums/enums"


export interface IAdmin{
    id:string
    name:string
    email:string
    password:string
    admintype:AdminTypes
    accesslevel: AccessLevels
    Islogged_in:boolean
    Islogged_out:boolean
    Isverfified:boolean
    Isregistered:boolean 
    Isdenied_access:boolean
    login_count:number
    reset_link_exptime:Date
    password_reset_link:string
    role:Roles
    created_at: Date
    AdminID:string
    


}

export interface ICreateOtherAdmin {
   
    AdminID:string
    email:string
    accesslevel:AccessLevels
    AdminType:AdminTypes
    password:string
    created_at:Date
}

export interface IUpgradeAdminClearanceLevel {
    ClearanceLevel:AccessLevels
   
}

export interface IChangeAdminType{
    AdminType:AdminTypes
   
}

export interface IAdminChangePassword{
    password:string
}
