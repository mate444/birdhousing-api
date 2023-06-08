import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class User_address {
  @PrimaryGeneratedColumn('increment')
    id: number;

  @Column('varchar', { length: 100 })
    address: string;

  @Column({ type: 'varchar', length: 30 })
    name: string;

  @Column({ type: 'varchar', length: 30 })
    lastname: string;

  @Column({ type: 'varchar', length: 30 })
    country: string;

  @Column({ type: 'varchar', length: 50 })
    city: string;

  @Column({ type: 'varchar', length: 20 })
    postalCode: string;

  @Column({ type: 'varchar', length: 20 })
    phoneNumber: string;

  @ManyToOne(() => User, (user) => user.addresses)
    user: User;
}
