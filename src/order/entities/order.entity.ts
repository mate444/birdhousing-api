import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { OrderStatusEnum } from "../interfaces/order.interface";
import { Birdhouse } from '../../birdhouse/entities/Birdhouse.entity';
import { User } from "../../user/entities/User.entity";
import { User_address } from "../../user/entities/User_address";

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'enum', enum: OrderStatusEnum, default: "pending confirmation" })
    status: OrderStatusEnum;

  @Column({ type: 'double' })
    price: number;

  @CreateDateColumn({ type: 'datetime' })
    createdAt: string;

  @UpdateDateColumn()
    updatedAt: string;

  @Column({ type: 'date', nullable: true })
    calculatedArrival: string;

  @ManyToMany(() => Birdhouse, { cascade: true, eager: true })
  @JoinTable()
    birdhouses: Birdhouse[];

  @ManyToOne(() => User, (user) => user.orders, { cascade: true })
    user: User;

  @ManyToOne(() => User_address)
    address: User_address;
}
