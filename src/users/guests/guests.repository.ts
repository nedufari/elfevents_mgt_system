import { EntityRepository, Repository } from "typeorm";
import { GuestEntity } from "../../Entity/guests.entity";
import { Notifications } from "../../Entity/notifications.entity";
import { UserOtp } from "../../Entity/otp.entity";

@EntityRepository(GuestEntity)
export class GuestRepository extends Repository <GuestEntity>{}


@EntityRepository(Notifications)
export class NotificationsRepository extends Repository <Notifications>{}

@EntityRepository(UserOtp)
export class UserOtpRepository extends Repository <UserOtp>{}