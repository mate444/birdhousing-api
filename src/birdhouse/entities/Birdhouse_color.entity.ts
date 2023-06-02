import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Birdhouse } from "./Birdhouse.entity";

@Entity()
export class Birdhouse_color {
  @PrimaryGeneratedColumn('increment')
    id: string;

  @Column('varchar', { length: 20 })
    color: string;

  @ManyToOne(() => Birdhouse, (birdhouse) => birdhouse.colors)
    birdhouse: Birdhouse;
}
