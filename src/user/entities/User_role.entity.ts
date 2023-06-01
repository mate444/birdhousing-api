import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { UserRoleEnum } from "../interfaces/user.interface";
import { User_permission } from "./User_permission";

@Entity()
export class User_role {
  @PrimaryGeneratedColumn('increment')
    id: number;

  @Column({ type: 'enum', enum: UserRoleEnum, unique: true })
    rolename: string;

  @ManyToMany(() => User_permission, { cascade: true, eager: true })
  @JoinTable()
    permissions: User_permission[];
}
