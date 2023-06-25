import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserStatusEnum } from "../interfaces/user.interface";
import { User_role } from "./User_role.entity";
import { User_address } from "./User_address";
import { Order } from "../../order/entities/order.entity";

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

  @Column({ type: "varchar", length: 50 })
    country: string;

  @OneToMany(() => User_address, (user_address) => user_address.user, { cascade: true })
    addresses: User_address[];

  @ManyToOne(() => User_role, (user_role) => user_role.id)
  @JoinColumn()
    role: User_role;

  @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
