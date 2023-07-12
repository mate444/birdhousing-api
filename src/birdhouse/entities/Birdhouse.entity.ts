import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BirdhouseStatusEnum } from "../interfaces/birdhouse.interface";
import { Birdhouse_style } from "./Birdhouse_style.entity";
import { Birdhouse_picture } from "./Birdhouse_picture.entity";
import { Birdhouse_socialMedia } from "./Birdhouse_socialMedia.entity";

@Entity()
export class Birdhouse {
    @PrimaryGeneratedColumn('uuid')
      birdhouseId: string;

    @Column('varchar', { length: 45 })
      name: string;

    @Column({ type: 'double' })
      price: number;

    @Column({ type: 'decimal' })
      size: number;

    @Column({ length: 255 })
      description: string;

    @Column({ type: 'int' })
      stock: number;

    @Column({ type: 'enum', enum: BirdhouseStatusEnum, default: BirdhouseStatusEnum.active })
      status: BirdhouseStatusEnum;

    @OneToMany(() => Birdhouse_style, (birdhouse_style) => birdhouse_style.birdhouse)
      styles: Birdhouse_style[];

    @OneToMany(() => Birdhouse_picture, (birdhouse_picture) => birdhouse_picture.birdhouse)
      pictures: Birdhouse_picture[];

    @OneToMany(() => Birdhouse_socialMedia, (birdhouse_socialMedia) => birdhouse_socialMedia.birdhouse)
      socialMedia: Birdhouse_socialMedia[];
}
