import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestEntity } from '../../Entity/guests.entity';
import {
  GuestRepository,
  NotificationsRepository,
} from '../guests/guests.repository';
import { Notifications } from '../../Entity/notifications.entity';
import { Mailer } from '../../mailer/mailer.service';
import { customAlphabet } from 'nanoid';
import { AdminEntity } from '../../Entity/admin.entity';
import { AdminRepository } from './admin.repository';
import {
  IAdmin,
  IAdminChangePassword,
  IChangeAdminType,
  ICreateOtherAdmin,
  IUpgradeAdminClearanceLevel,
} from './admin';
import { AdminService } from './admin.service';
import {
  AccreditationDto,
  ChangeAdmintypeDto,
  CreateAdminDto,
  UpgradeClearanceLevelDto,
  distinguishGuestsDto,
} from './dto/adminAction.dto';
import {
  Accreditation,
  ComingAlongWithSomeone,
  GuestsStatus,
  NotificationType,
} from '../../Enums/enums';
import { IGuests, IGuestsResponse } from '../guests/guests';
import { ILike, Like, Raw, getRepository } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-writer';

@Injectable()
export class AdminActionService {
  constructor(
    @InjectRepository(GuestEntity) private guestripo: GuestRepository,
    @InjectRepository(Notifications)
    private notificationripo: NotificationsRepository,
    @InjectRepository(AdminEntity) private readonly adminripo: AdminRepository,
    private mailerservice: Mailer,
    private adminservice: AdminService,
  ) {}

  private generatePassword(): string {
    const nanoid = customAlphabet(
      '1234567890abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ',
      12,
    );
    return nanoid();
  }

  private adminid(): string {
    const nanoid = customAlphabet('1234567890', 6);
    return nanoid();
  }

  //create various kinds of admins
  async CreateAnyAdminKind(
    id: string,
    createadmindto: CreateAdminDto,
  ): Promise<ICreateOtherAdmin> {
    try {
      const admin = await this.adminripo.findOne({ where: { id: id } });
      if (!admin)
        throw new HttpException(
          `admin with ${id} not found`,
          HttpStatus.NOT_FOUND,
        );

        const checkemail = await this.adminripo.findOne({
          where: { email: createadmindto.email },
        });
        if (checkemail)
          throw new HttpException(
            'this admin has already been created by you',
            HttpStatus.CONFLICT,
          );

      const plainpassword = this.generatePassword();
      const hashedpassword =
      await this.adminservice.hashpassword(plainpassword);

      //create a password and adminid ,role, //password is auto generated
      const newAdmin = new AdminEntity();
      newAdmin.AdminID = this.adminid();
      newAdmin.name = createadmindto.name;
      newAdmin.password = hashedpassword;
      newAdmin.created_at = new Date();
      newAdmin.admintype = createadmindto.admintype;
      newAdmin.accesslevel = createadmindto.accessLevel;
      newAdmin.Isverfified = true;
      newAdmin.email = `${createadmindto.email}@elfevents.com`;

      await this.adminripo.save(newAdmin);

      //response
      const adminresponse: ICreateOtherAdmin = {
        AdminID: newAdmin.AdminID,
        email: newAdmin.email,
        AdminType: newAdmin.admintype,
        created_at: newAdmin.created_at,
        accesslevel: newAdmin.accesslevel,
        password: plainpassword,
      };

      //save the notification
      const notification = new Notifications();
      notification.account = admin.id;
      notification.subject = 'Admin created by a super admin !';
      notification.notification_type = NotificationType.OTHER_ADMIN_CREATED;
      notification.message = `a new admin has ben created as  ${newAdmin.admintype} on elfevents dashboard `;
      await this.notificationripo.save(notification);

      return adminresponse;
    } catch (error) {
      throw error;
    }
  }

  async getalladmins(): Promise<IAdmin[]> {
    const admins = await this.adminripo.find();
    return admins;
  }

  //UPGRADE THE LEVEL OF AN ADMIN
  async UpgradeAdminClearanceLevel(
    id: string,
    adminid: string,
    dto: UpgradeClearanceLevelDto,
  ): Promise<{ message: string; response: IUpgradeAdminClearanceLevel }> {
    try {
      const admin = await this.adminripo.findOne({ where: { id: id } });
      if (!admin)
        throw new HttpException(
          `super admin with ${id} not found`,
          HttpStatus.NOT_FOUND,
        );

      const isAdmin = await this.adminripo.findOne({
        where: { id: adminid },
      });
      if (!isAdmin)
        throw new HttpException(
          `the admin to be ugraded  with the id  ${adminid} is not found`,
          HttpStatus.NOT_FOUND,
        );

      isAdmin.accesslevel = dto.accessLevel;
      await this.adminripo.save(isAdmin);

      //save the notification
      const notification = new Notifications();
      notification.account = isAdmin.id;
      notification.subject = 'Admin clearance level upgraded !';
      notification.notification_type =
        NotificationType.ADMIN_CLEARANCE_UPGRADED;
      notification.message = `the admin with id ${adminid} clearance level has been upgraded to ${dto.accessLevel} on the admin portal of walkway by superadmin ${admin.name} `;
      await this.notificationripo.save(notification);

      const adminresponse: IUpgradeAdminClearanceLevel = {
        ClearanceLevel: isAdmin.accesslevel,
      };
      const messagerespnse = `admin with ${adminid} have been upgraded to ${dto.accessLevel} by the super admin ${admin.name}`;

      return { message: messagerespnse, response: adminresponse };
    } catch (error) {
      throw error;
    }
  }

  //change the admin type
  async UpgradeAdminType(
    id: string,
    adminid: string,
    dto: ChangeAdmintypeDto,
  ): Promise<{ message: string; response: IChangeAdminType }> {
    try {
      const admin = await this.adminripo.findOne({ where: { id: id } });
      if (!admin)
        throw new HttpException(
          `super admin with ${id} not found`,
          HttpStatus.NOT_FOUND,
        );

      const isAdmin = await this.adminripo.findOne({
        where: { id: adminid },
      });
      if (!isAdmin)
        throw new HttpException(
          `the admin to be ugraded  with the id  ${adminid} is not found`,
          HttpStatus.NOT_FOUND,
        );

      isAdmin.admintype = dto.admintype;
      await this.adminripo.save(isAdmin);

      //save the notification
      const notification = new Notifications();
      notification.account = isAdmin.id;
      notification.subject = 'Admin clearance level upgraded !';
      notification.notification_type =
        NotificationType.ADMIN_CLEARANCE_UPGRADED;
      notification.message = `the admin with id ${adminid} admintype has been changed to ${dto.admintype} on the admin portal of walkway by superadmin ${admin.name} `;
      await this.notificationripo.save(notification);

      const adminresponse: IChangeAdminType = {
        AdminType: isAdmin.admintype,
      };
      const messagerespnse = `admin with ${adminid} admin type has been changed to ${dto.admintype} by the super admin ${admin.name}`;

      return { message: messagerespnse, response: adminresponse };
    } catch (error) {
      throw error;
    }
  }

  async AdminChangeotherAdmiPassword(
    id: string,
    adminid: string,
  ): Promise<{ message: string; response: IAdminChangePassword }> {
    const admin = await this.adminripo.findOne({ where: { id: id } });
    if (!admin)
      throw new HttpException(
        `super admin with ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    const isAdmin = await this.adminripo.findOne({
      where: { id: adminid },
    });
    if (!isAdmin)
      throw new HttpException(
        `the admin to be ugraded  with the id  ${adminid} is not found`,
        HttpStatus.NOT_FOUND,
      );

    //change the password
    const newpassword = this.generatePassword();
    const hashit = await this.adminservice.hashpassword(newpassword);
    isAdmin.password = hashit;
    await this.adminripo.save(isAdmin);

    //save the notification
    const notification = new Notifications();
    notification.account = isAdmin.id;
    notification.subject = 'Admin password changed !';
    notification.notification_type = NotificationType.ADMIN_PASSWORD_CHANGED;
    notification.message = `the admin with id ${adminid} password has been changed on the admin portal of walkway by superadmin ${admin.name} `;
    await this.notificationripo.save(notification);

    const adminresponse: IAdminChangePassword = {
      password: newpassword,
    };
    const messageresponse = `admin with ${adminid} password has been changed  by the super admin ${admin.name}`;

    return { message: messageresponse, response: adminresponse };
  }

  async AdminDeleteAdmin(
    id: string,
    adminid: string,
  ): Promise<{ message: string }> {
    const admin = await this.adminripo.findOne({ where: { id: id } });
    if (!admin)
      throw new HttpException(
        `super admin with ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    const isAdmin = await this.adminripo.findOne({
      where: { id: adminid },
    });
    if (!isAdmin)
      throw new HttpException(
        `the admin to be deleted with the id  ${adminid} is not found`,
        HttpStatus.NOT_FOUND,
      );

    //delete the admin
    await this.adminripo.remove(isAdmin);

    //save the notification
    const notification = new Notifications();
    notification.account = admin.id;
    notification.subject = 'Admin deleted !';
    notification.notification_type = NotificationType.ADMIN_DELETED;
    notification.message = `the admin with id ${adminid}  has been deleted on the admin portal of walkway by superadmin ${admin.name} `;
    await this.notificationripo.save(notification);

    return {
      message: ` ${isAdmin.name}  has been deleted  by the super admin ${admin.name}`,
    };
  }

  async SearchAndAccredidateGuests(
    id: string,
    keyword: any | string,
    dto: AccreditationDto,
  ): Promise<{
    message: string;
    totalcount: number;
    guest: IGuestsResponse[];
  }> {
    try {
      // Find admin
      const findAdmin = await this.adminripo.findOne({ where: { id: id } });
      if (!findAdmin) {
        throw new HttpException(
          `Admin with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Query the guest list for the access_code
      const guests = await this.guestripo.find({
        where: { access_code: ILike(`%${keyword}%`) },
        cache: false,
      });

      //console.log('Generated Query:', this.guestripo.createQueryBuilder().where({ access_code: ILike(`%${keyword}%`) }).getQuery());
      const totalcount = guests.length;

      if (totalcount === 0) {
        throw new HttpException(
          `No search result found for ${keyword}, oops! sorry you are not on the guest list`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (dto.accreditate !== undefined) {
        // Accreditate the list
        for (const guest of guests) {
          guest.accreditation_status = dto.accreditate;
          guest.status = GuestsStatus.CHECKED_IN;
        }
        await this.guestripo.save(guests);

        if (!dto.accreditate) {
          throw new HttpException(
            'Please accredit or deny entry for the guest',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const message = 'Guest is on the guest list';
      const guestresponse: IGuestsResponse[] = guests.map((one) => ({
        fullname: one.fullname,
        email: one.email,
        coming_with_any_other: one.coming_with_any_other,
        amount: one.amount,
        names: one.names,
        registration_date: one.registration_date,
        Isverfified: one.Isverfified,
        Isregistered: one.Isregistered,
        role: one.role,
        status: one.status,
        accreditation_status: one.accreditation_status,
        distinguished_as: one.distinguished_as,
      }));

      return { message, totalcount, guest: guestresponse };
    } catch (error) {
      throw error;
    }
  }

  // get total numbers of accreditated, denied and notyet and guestlists
  async totalguestsCount(): Promise<number> {
    return await this.guestripo.count();
  }

  async getAccreditedGuestCount(): Promise<number> {
    return this.guestripo.count({
      where: { accreditation_status: Accreditation.ACCREIDATED },
    });
  }

  async getDeniedGuestCount(): Promise<number> {
    return this.guestripo.count({
      where: { accreditation_status: Accreditation.DENIED },
    });
  }

  async getUnattendedGuestCount(): Promise<number> {
    return this.guestripo.count({
      where: { accreditation_status: Accreditation.NOT_YET },
    });
  }

  async getamoutofpeoplecomigwithextra(): Promise<number> {
    return this.guestripo.count({
      where: { coming_with_any_other: ComingAlongWithSomeone.YES },
    });
  }

  async getamoutofpeopleNotcomigwithextra(): Promise<number> {
    return this.guestripo.count({
      where: { coming_with_any_other: ComingAlongWithSomeone.NO },
    });
  }

  async gettotalextraguests(): Promise<number> {
    const guests = await this.guestripo.find();
    return guests.reduce(
      (amount, guest) => amount + Number(guest.amount || 0),
      0,
    );
  }

  async getExtraGuestsNames(): Promise<string[]> {
    const guests = await this.guestripo.find();
    return guests.reduce((names, guest) => names.concat(guest.names || []), []);
  }

  async getAllGuests(): Promise<IGuests[]> {
    const guests = await this.guestripo.find();
    return guests;
  }

  // clear entire guestlist only by superadmin
  async DownloadAndclearEntireGuestList(
    id: string,
  ): Promise<{ message: string; filepath: string }> {
    try {
      const admin = await this.adminripo.findOne({ where: { id: id } });
      if (!admin)
        throw new HttpException(
          `the user with id ${id} is not found`,
          HttpStatus.NOT_FOUND,
        );

      const guests = await this.guestripo.find();

      if (guests.length === 0) {
        throw new HttpException(
          'No records to download or clear.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const outputPath = path.resolve(__dirname, '../../downloads');
      const outputFilePath = path.join(outputPath, 'guest_list.csv');

      const csvWriter = csv.createObjectCsvWriter({
        path: outputFilePath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'fullname', title: 'Full Name' },
          { id: 'sm_handle', title: 'Social Media Handle' },
          { id: 'phone', title: 'Phone' },
          { id: 'email', title: 'Email' },
          { id: 'coming_with_any_other', title: 'Coming with Others' },
          { id: 'amount', title: 'Amount' },
          { id: 'names', title: 'Names' },
          { id: 'Isverfified', title: 'Is Verified' },
          { id: 'Isregistered', title: 'Is Registered' },
          { id: 'status', title: 'Status' },
          { id: 'Isdenied_entry', title: 'Is Denied Entry' },
          { id: 'Ischeckedin', title: 'Is Checked In' },
          { id: 'registration_date', title: 'Registration Date' },
          { id: 'access_code', title: 'Access Code' },
          { id: 'role', title: 'Role' },
          { id: 'accreditation_status', title: 'Accreditation Status' },
        ],
      });

      await csvWriter.writeRecords(guests);

      //clear all records
      await this.guestripo.clear();

      //save the notification
      const notification = new Notifications();
      notification.account = admin.id;
      notification.subject = 'Admin downloaded and cleared the list';
      notification.notification_type =
        NotificationType.ADMIN_DOWNLOADED_AND_CLEARED_THE_GUEST_LIST;
      notification.message = `the admin with id ${id}  has been dowloaded and deleted the entire guest list  `;
      await this.notificationripo.save(notification);

      return {
        message:
          'you have successfully cleared the entire guest list. please follow the filepath to see the downloaded guestlist',
        filepath: outputFilePath,
      };
    } catch (error) {
      throw error;
    }
  }

  async downloadGuestList(): Promise<{ message: string; filepath: string }> {
    try {
      const guests = await this.guestripo.find();

      if (guests.length === 0) {
        throw new HttpException(
          'No records to download or clear.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const outputPath = path.resolve(__dirname, '../../downloads');
      const outputFilePath = path.join(outputPath, 'guest_list.csv');

      // Create the downloads directory if it doesn't exist
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const csvWriter = csv.createObjectCsvWriter({
        path: outputFilePath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'fullname', title: 'Full Name' },
          { id: 'sm_handle', title: 'Social Media Handle' },
          { id: 'phone', title: 'Phone' },
          { id: 'email', title: 'Email' },
          { id: 'coming_with_any_other', title: 'Coming with Others' },
          { id: 'amount', title: 'Amount' },
          { id: 'names', title: 'Names' },
          { id: 'Isverfified', title: 'Is Verified' },
          { id: 'Isregistered', title: 'Is Registered' },
          { id: 'status', title: 'Status' },
          { id: 'Isdenied_entry', title: 'Is Denied Entry' },
          { id: 'Ischeckedin', title: 'Is Checked In' },
          { id: 'registration_date', title: 'Registration Date' },
          { id: 'access_code', title: 'Access Code' },
          { id: 'role', title: 'Role' },
          { id: 'accreditation_status', title: 'Accreditation Status' },
        ],
      });

      await csvWriter.writeRecords(guests);

      return {
        message: 'you have downloaded the guestlist',
        filepath: outputFilePath,
      };
    } catch (error) {
      throw error;
    }
  }

  async distinguishGuest(
    id: string,
    guestid: string,
    dto: distinguishGuestsDto,
  ): Promise<{ message: string }> {
    try {
      const admin = await this.adminripo.findOne({ where: { id: id } });
      if (!admin)
        throw new HttpException('admin does not exist', HttpStatus.NOT_FOUND);

      const guest = await this.guestripo.findOne({ where: { id: guestid } });

      //distinguish guest
      guest.distinguished_as = dto.distinguish;
      await this.guestripo.save(guest);

      //save the notification
      const notification = new Notifications();
      notification.account = admin.id;
      notification.subject = 'Guest Distinguished';
      notification.notification_type = NotificationType.GUEST_DISTINGUISHED_AS;
      notification.message = `the admin with id ${id}  has distinguished the guest, ${guest.fullname} as a ${dto.distinguish}  `;
      await this.notificationripo.save(notification);

      return {
        message: `guest has been distinguished by the client ${admin.name} as  ${dto.distinguish}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
