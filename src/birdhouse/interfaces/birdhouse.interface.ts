import { Express } from 'express';
export enum BirdhouseStatusEnum {
  active = 'active',
  inactive = 'inactive'
}

export interface BirdhouseInterface {
  birdhouseId: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  status: BirdhouseStatusEnum;
  size: number;
  pictures: Express.Multer.File[] | undefined;
  styles: string[];
  socialMedia: string[]
}
