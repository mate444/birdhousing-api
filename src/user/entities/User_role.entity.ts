import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { UserRoleEnum } from "../interfaces/user.interface";
import { User_permission } from "./Role_permission.entity";

@Entity()
export class User_role {
  @PrimaryGeneratedColumn('increment')
    id: number;

  @Column({ type: 'enum', enum: UserRoleEnum })
    rolename: string;

  @ManyToMany(() => User_permission, { cascade: true })
  @JoinTable()
    permissions: User_permission[];
}
