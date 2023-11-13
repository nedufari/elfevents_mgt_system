
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ACCESSLEVEL_KEY, ADMINTYPE_KEY, } from "../decorator/role.decorator";
import { AccessLevels, AdminTypes } from "../../Enums/enums";


// GUARD FOR THE ADMINTYPE
@Injectable()
export class AdmintypeGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('AdmintypeGuard executed');
        
        const requiredAdminTypes=this.reflector.getAllAndOverride<AdminTypes[]>(ADMINTYPE_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredAdminTypes){
            return true
        }
        const {user}=context.switchToHttp().getRequest();
        return requiredAdminTypes.some(admintype=>user.admintype === admintype);
    }
        
    }


    //GUARD FOR THE ACCESSLEVEL
    @Injectable()
    export class AccessLevelGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('AdmintypeGuard executed');
        
        const requiredAaccessLevel=this.reflector.getAllAndOverride<AccessLevels[]>(ACCESSLEVEL_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredAaccessLevel){
            return true
        }
        const {user}=context.switchToHttp().getRequest();
        return requiredAaccessLevel.some(accesslevel=>user.accesslevel === accesslevel);
    }
        
    }


