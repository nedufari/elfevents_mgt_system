import { AccessLevels, Accreditation, AdminTypes, ComingAlongWithSomeone, GuestType, GuestsStatus, Roles } from "../../Enums/enums"


export interface IGuests{
    id:string
    fullname:string
    sm_handle:string
    phone:string
    email:string
    coming_with_any_other:ComingAlongWithSomeone
    amount:number
    names:string[]
    Isverfified:boolean
    Isregistered:boolean 
    status: GuestsStatus
    Isdenied_entry:boolean
    Ischeckedin:boolean
    registration_date: Date
    access_code : string
    role:Roles
    accreditation_status:Accreditation
    distinguished_as:GuestType
    event_time:string
    event_location:string
    event_title:string

}


export interface IGuestsResponse{
    fullname:string
    email:string
    coming_with_any_other?:ComingAlongWithSomeone
    amount?:number
    names?:string[]
    Isverfified:boolean
    Isregistered:boolean 
    status: GuestsStatus
    registration_date: Date
    role:Roles
    accreditation_status:Accreditation
    distinguished_as:GuestType

}




