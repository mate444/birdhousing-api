import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { OrderStatusEnum } from "../interfaces/order.interface";
import { Birdhouse } from '../../birdhouse/entities/Birdhouse.entity';
import { User } from "../../user/entities/User.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'enum', enum: OrderStatusEnum, default: "pending confirmation" })
    status: OrderStatusEnum;

  @Column({ type: 'double' })
    price: number;

  @Column({ type: 'datetime' })
    createdAt: string;

  @Column({ type: 'datetime' })
    updatedAt: string;

  @ManyToMany(() => Birdhouse, { cascade: true, eager: true })
  @JoinTable()
    birdhouses: Birdhouse[];

  @ManyToOne(() => User, (user) => user.orders, { cascade: true })
    user: User;
}
