import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Birdhouse } from "./Birdhouse.entity";
import { File } from "buffer";

@Entity()
export class Birdhouse_picture {
  @PrimaryGeneratedColumn('increment')
    id: string;

  @Column('blob', { nullable: true })
    picture: File;

  @ManyToOne(() => Birdhouse, (birdhouse) => birdhouse.pictures)
    birdhouse: Birdhouse;
}
