import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BirdhouseStatusEnum } from "../interfaces/birdhouse.interface";
import { Birdhouse_color } from "./Birdhouse_color.entity";
import { Birdhouse_style } from "./Birdhouse_style.entity";
import { Birdhouse_picture } from "./Birdhouse_picture.entity";

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

    @OneToMany(() => Birdhouse_color, (birdhouse_color) => birdhouse_color.birdhouse)
      colors: Birdhouse_color[];

    @OneToMany(() => Birdhouse_picture, (birdhouse_picture) => birdhouse_picture.birdhouse)
      pictures: Birdhouse_picture[];
}
