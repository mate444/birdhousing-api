import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { UserStatusEnum } from "../interfaces/user.interface";
import { User_role } from "./User_role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', length: 255 })
    email: string;

  @Column({ type: 'varchar', length: 80 })
    password: string;

  @Column({ type: 'enum', enum: UserStatusEnum })
    status: UserStatusEnum;

  @Column({ type: 'varchar', length: 30 })
    name: string;

  @Column({ type: 'varchar', length: 30 })
    lastname: string;

  @OneToOne(() => User_role, { cascade: true })
  @JoinColumn()
    roleId: number;
}
