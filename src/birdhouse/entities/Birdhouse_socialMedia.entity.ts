import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Birdhouse } from "./Birdhouse.entity";

@Entity()
export class Birdhouse_socialMedia {
  @PrimaryGeneratedColumn('increment')
    id: number;

  @Column('varchar', { length: 20 })
    name: string;

  @Column('varchar', { length: 255 })
    link: string;

  @ManyToOne(() => Birdhouse, (birdhouse) => birdhouse.socialMedia)
    birdhouse: Birdhouse;
}
