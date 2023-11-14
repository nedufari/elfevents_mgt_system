export enum GuestsStatus{
    CHECKED_IN = "checked_in",
    CHECKED_OUT = " checked_out",
    UNATTENDED_TO = "unattended_to"

}

export enum Accreditation{
    ACCREIDATED ="accreditated",
    DENIED = "denied",
    NOT_YET ="not_yet"
}

export enum AdminTypes{
    SUPER_ADMIN = "super_admin",
    REGISTRATION_ELF = "registration_elf",
    CORDINATOR = "cordinator",
    CLIENT = "client"
    

}

export enum Roles{
    SUPER_ADMIN = "super_admin",
    ADMIN ="admin",
    GUEST="guest",
    CORDINATOR="cordinator",
    USHER="usher",
    
}

export enum AccessLevels{
    HIGHEST_LEVEL ="highest_level",
    MID_LEVEL = "mid_level",
    LOWEST_LEVEL = "lowest_level"
}



export enum NotificationType{
    GUEST_REGISTERED =" guest_registered",
    GUEST_CHECKED_IN ="guest_checked_in",
    QUEST_RECORDS_UPDATED ="guest_records_updated",
    QUEST_REMOVED_FROM_GUEST_LIST ="guest_removed_from_guest_list",
    SUPER_ADMIN_CREATED =" super_admin_created",
    OTHER_ADMIN_CREATED ="other_admin_created",
    OTHER_ADMIN_LOGGED_IN ="other_admin_logged_in",
    EMAIL_VERIFICATION = "email_verification",

    ADMIN_CREATED="admin_created",
    ADMIN_DELETED="admin_deleted",
    ADMIN_CLEARANCE_UPGRADED="admin_clearance_upgraded",
    ADMIN_PASSWORD_CHANGED="admin_password_changed",

}

export enum ComingAlongWithSomeone{
    YES ="yes",
    NO ='no'
}



