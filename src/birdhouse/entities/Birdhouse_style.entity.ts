import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Birdhouse } from "./Birdhouse.entity";

@Entity()
export class Birdhouse_style {
  @PrimaryGeneratedColumn('increment')
    id: string;

  @Column('varchar', { length: 20 })
    style: string;

  @ManyToOne(() => Birdhouse, (birdhouse) => birdhouse.styles)
    birdhouse: Birdhouse;
}
