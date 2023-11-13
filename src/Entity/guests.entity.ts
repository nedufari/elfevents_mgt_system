import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AccessLevels, Accreditation, AdminTypes, ComingAlongWithSomeone, GuestsStatus, Roles } from "../Enums/enums";
import { IAdmin } from "../users/admin/admin";
import { IGuests } from "../users/guests/guests";

@Entity('guests')
export class GuestEntity implements IGuests{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique:true, nullable:false})
    email:string

    @Column({nullable:true})
    fullname:string

    @Column({nullable:true})
    sm_handle:string

    @Column({nullable:true})
    phone:string

    @Column({nullable:false})
    access_code:string

    @Column({enum:GuestsStatus, type:'enum', nullable:false,default:GuestsStatus.UNATTENDED_TO})
    status:GuestsStatus

    @CreateDateColumn()
    registration_date: Date

    @Column({enum:Roles, type:'enum', default:Roles.GUEST})
    role:Roles

    @Column({type:'boolean', default:false, nullable:true})
    Isverfified:boolean

    @Column({type:'boolean', default:false, nullable:true})
    Ischeckedin:boolean

    @Column({type:'boolean', default:false, nullable:true})
    Isdenied_entry:boolean

    @Column({type:'enum', enum:ComingAlongWithSomeone, default:ComingAlongWithSomeone.NO})
    coming_with_any_other:ComingAlongWithSomeone

    @Column({ nullable:true})
    amount:number

    @Column({type:'simple-array',nullable:true})
    names:string[]

    @Column({type:'boolean', default:false, nullable:true})
    Isregistered:boolean 

    @Column({type:'enum', enum:Accreditation, default:Accreditation.NOT_YET})
    accreditation_status:Accreditation

   



}