import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards,ForbiddenException } from "@nestjs/common";
import { AdminActionService } from "./adminActions.service";
import { AccreditationDto, ChangeAdmintypeDto, CreateAdminDto, UpgradeClearanceLevelDto } from "./dto/adminAction.dto";
import { IAdmin, IAdminChangePassword, IChangeAdminType, ICreateOtherAdmin, IUpgradeAdminClearanceLevel } from "./admin";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import {  AccessLevelGuard, AdmintypeGuard } from "../../auth/guards/role.guard";
import { AccessLevelDecorator, AdminType } from "../../Auth/decorator/role.decorator";
import { AccessLevels, AdminTypes} from "../../Enums/enums";
import { IGuestsResponse } from "../guests/guests";

@UseGuards(JwtGuard)

@Controller('admin-action')
export class AdminActionController{
    constructor(private adminactionservice:AdminActionService){}

    //super admin actions 

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN)
    @Post('/create-other-admin/:id')
    async CreateOtherAdmin(@Body()dto:CreateAdminDto,@Param('id')id:string):Promise<ICreateOtherAdmin>{
        return await this.adminactionservice.CreateAnyAdminKind(id,dto)
    }

    // @UseGuards(AdmintypeGuard)
    // @AdminType(AdminTypes.CORDINATOR)
    @Get('all-admins')
    async getAllAdmins(@Req()request):Promise<IAdmin[]>{
        try {
           
            console.log(request.user.email)
            console.log(request.user.id)
            return await this.adminactionservice.getalladmins()
            
        } catch (error) {
            throw error
        }
       
    }

    
    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN)
    @Patch('upgrade-clearancelevel/:id/:adminid')
    async upgradeAdminClearance(@Param('id')id:string,@Param('adminid')adminid:string,@Body()dto:UpgradeClearanceLevelDto,@Req()request):Promise<{message:string,response:IUpgradeAdminClearanceLevel}>{
        const newAdmin = await this.adminactionservice.UpgradeAdminClearanceLevel(id,adminid,dto)
        return newAdmin
    }

    
    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN)
    @Patch('change-admintype/:id/:adminid')
    async changeeAdminType(@Param('id')id:string,@Param('adminid')adminid:string,@Body()dto:ChangeAdmintypeDto,@Req()request):Promise<{message:string,response:IChangeAdminType}>{
        const newAdmin = await this.adminactionservice.UpgradeAdminType(id,adminid,dto)
        return newAdmin
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN)
    @Patch('change-adminpassword/:id/:adminid')
    async changeAdminPassword(@Param('id')id:string,@Param('adminid')adminid:string,@Req()request):Promise<{message:string,response:IAdminChangePassword}>{
        const newAdmin = await this.adminactionservice.AdminChangeotherAdmiPassword(id,adminid,)
        return newAdmin
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN)
    @Delete('deleteAdmin/:id/:adminid')
    async AdminDeleteOtherAdmin(@Param('id')id:string,@Param('adminid')adminid:string,@Req()request):Promise<{message:string}>{
        const newAdmin = await this.adminactionservice.AdminDeleteAdmin(id,adminid)
        return newAdmin
    }



    //other admin actions 

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF)
    @Post('accredit/:id')
    async accreditGuests(@Param('id') id: string, @Query('keyword') keyword: string,@Body()dto:AccreditationDto) :Promise<{ message: string; totalcount: number; guest: IGuestsResponse[]}>{
      try {
        return  await this.adminactionservice.SearchAndAccredidateGuests(id, keyword,dto );
      } catch (error) {
        throw error;
      }
    
    }

    //extra statistics 
    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('accredited-guest-count')
    async getAccreditedGuestCount(): Promise<{ count: number }> {
      const count = await this.adminactionservice.getAccreditedGuestCount();
      return { count };
    }
  
    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('denied-guest-count')
    async getDeniedGuestCount(): Promise<{ count: number }> {
      const count = await this.adminactionservice.getDeniedGuestCount();
      return { count };
    }
  
    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('unattended-guest-count')
    async getUnattendedGuestCount(): Promise<{ count: number }> {
      const count = await this.adminactionservice.getUnattendedGuestCount();
      return { count };
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('total-guest-coming-with-extra')
    async getTotalofguestComingWithGuest(): Promise<{ count: number }> {
      const count = await this.adminactionservice.getamoutofpeoplecomigwithextra();
      return { count };
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('total-guest-not-coming-with-extra')
    async getTotalofguestNotComingWithGuest(): Promise<{ count: number }> {
      const count = await this.adminactionservice.getamoutofpeopleNotcomigwithextra();
      return { count };
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('total-extra-guests-count')
    async getTotalExtraGuestsCount(): Promise<{ count: number }> {
      const count = await this.adminactionservice.gettotalextraguests();
      return { count };
    }
  
    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('extra-guests-names')
    async getExtraGuestsNames(): Promise<{ names: string[] }> {
      const names = await this.adminactionservice.getExtraGuestsNames();
      return { names };
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN, AdminTypes.CORDINATOR, AdminTypes.REGISTRATION_ELF,AdminTypes.CLIENT)
    @Get('total-guests')
    async getTotalGuests(): Promise<{ count: number }> {
      const count = await this.adminactionservice.totalguestsCount();
      return { count };
    }

    @UseGuards(AdmintypeGuard)
    @AdminType(AdminTypes.SUPER_ADMIN,AdminTypes.CLIENT)
    @Post('download-guest-list')
    async downloadguestlist():Promise<{message:string,filepath:string}>{
      return await this.adminactionservice.downloadGuestList()
    }


    @UseGuards(AdmintypeGuard,AccessLevelGuard)
    @AdminType(AdminTypes.SUPER_ADMIN)
    @AccessLevelDecorator(AccessLevels.HIGHEST_LEVEL)
    @Post('clear-download-guest-list/:id')
    async downloadandclearguestlist(@Param('id')id:string,@Req()request):Promise<{message:string,filepath:string}>{
      try {

        const userfromRequest = request.user.id
        if (userfromRequest !== id) throw new ForbiddenException('you are not allowed to perform this action because you are not the owner of this account')

        return await this.adminactionservice.DownloadAndclearEntireGuestList(id)
      } catch (error) {
        
      }
      
    }
}