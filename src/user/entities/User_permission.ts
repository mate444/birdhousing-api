import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User_permission {
  @PrimaryGeneratedColumn('increment')
    id: number;

  @Column('varchar', { length: 20, unique: true })
    permission: string;
}
