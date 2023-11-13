import { SetMetadata } from "@nestjs/common";
import { AccessLevels, AdminTypes } from "../../Enums/enums";

//decorator for the admitype
export const ADMINTYPE_KEY = 'admintype'
export const AdminType=(...admintype:AdminTypes[])=>SetMetadata(ADMINTYPE_KEY,admintype);


//decorator for the accesslevel
export const ACCESSLEVEL_KEY = 'accesslevel'
export const AccessLevelDecorator=(...accesslevel:AccessLevels[])=>SetMetadata(ACCESSLEVEL_KEY,accesslevel);
