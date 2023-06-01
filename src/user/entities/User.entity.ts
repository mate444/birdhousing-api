import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { UserStatusEnum } from "../interfaces/user.interface";
import { User_role } from "./User_role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

  @Column({ type: 'varchar', length: 80 })
    password: string;

  @Column({ type: 'enum', enum: UserStatusEnum, default: 'active' })
    status: UserStatusEnum;

  @Column({ type: 'varchar', length: 30 })
    name: string;

  @Column({ type: 'varchar', length: 30 })
    lastname: string;

  @ManyToOne(() => User_role, (user_role) => user_role.id)
  @JoinColumn()
    role: number;
}
