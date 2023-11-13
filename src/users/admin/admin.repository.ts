import { EntityRepository, Repository } from "typeorm";
import { AdminEntity } from "../../Entity/admin.entity";

@EntityRepository(AdminEntity)
export class AdminRepository extends Repository <AdminEntity>{}