import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AccessLevels, AdminTypes, GuestsStatus, Roles } from "../Enums/enums";
import { IAdmin } from "../users/admin/admin";

@Entity('admin')
export class AdminEntity implements IAdmin{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique:false, nullable:false})
    email:string

    @Column({nullable:false})
    password:string

    @Column({nullable:true})
    name:string

    @Column({nullable:true})
    AdminID:string

    @Column({enum:AdminTypes, type:'enum', nullable:false,default:AdminTypes.SUPER_ADMIN})
    admintype:AdminTypes

    @Column({enum:Roles, type:'enum', default:Roles.ADMIN})
    role:Roles

    @Column({enum:AccessLevels, type:'enum', nullable:false})
    accesslevel:AccessLevels

    @CreateDateColumn()
    created_at: Date


    @Column({type:'boolean', default:false, nullable:true})
    Islogged_in:boolean

    @Column({type:'boolean', default:false, nullable:true})
    Islogged_out:boolean

    @Column({type:'boolean', default:false, nullable:true})
    Isverfified:boolean

    @Column({type:'boolean', default:false, nullable:true})
    Isregistered:boolean 

    @Column({type:'boolean', default:false, nullable:true})
    Isdenied_access:boolean

    @Column({ default:0,nullable:true})
    login_count:number

    @Column({type:"date", nullable:true})
    last_login:Date

    @Column({nullable:true})
    reset_link_exptime:Date

    @Column({nullable:true})
    password_reset_link:string

    @Column({type:'boolean',default:false})
    is_locked:boolean

    @Column({type:'date',nullable:true})
    is_locked_until:Date

}