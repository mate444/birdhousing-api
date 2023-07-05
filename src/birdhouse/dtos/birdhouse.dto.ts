import {
  MinLength,
  MaxLength,
  IsInt,
  IsString,
  IsArray,
  IsNumber,
  IsUUID,
  IsEnum,
  IsUrl
} from "class-validator";
import { isFile } from "../../common/validateFile";
import { Express } from 'express';
import { BirdhouseStatusEnum } from "../interfaces/birdhouse.interface";

export class CreateBirdhouseDto {
  @IsString()
  @MinLength(1, {
    message: 'Birdhouse name is too short'
  })
  @MaxLength(45, {
    message: 'Birdhouse name is too long'
  })
    name: string;

  @IsInt({ message: 'Birdhouse stock must be an integer number' })
    stock: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Birdhouse price must be a double number' })
    price: number;

  @IsString({ message: 'Birdhouse description must be a string' })
  @MinLength(1, { message: 'Birdhouse description is too short' })
  @MaxLength(255, { message: 'Birdhouse description is too long' })
    description: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Birdhouse size must be a number' })
    size: number;

  @IsArray({ message: 'Birdhouse pictures must be inside an array' })
  @isFile({
    mime: ['image/webp']
  }, {
    each: true, message: 'Birdhouse picture must be [image/jpeg, image/jpg, image/png]'
  })
    pictures: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };

  @IsArray()
  @IsString({ each: true, message: 'Birdhouse style must be a string' })
  @MinLength(1, { each: true, message: 'Birdhouse style is too short' })
  @MaxLength(45, { each: true, message: 'Birdhouse style is too long' })
    styles: string[];
}

export class DeleteBirdhouseDto {
  @IsUUID(4, { message: 'Birdhouse id must be a V4 UUID' })
    birdhouseId: string;

  @IsEnum(BirdhouseStatusEnum, { message: 'Birdhouse status is incorrect' })
    status: BirdhouseStatusEnum;
}

export class UpdateBirdhouseDto {
  @IsUUID(4, { message: 'Birdhouse id must be a V4 UUID' })
    birdhouseId: string;

    @IsString()
    @MinLength(1, {
      message: 'Birdhouse name is too short'
    })
    @MaxLength(45, {
      message: 'Birdhouse name is too long'
    })
      name: string;

    @IsInt({ message: 'Birdhouse stock must be an integer number' })
      stock: number;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Birdhouse price must be a double number' })
      price: number;

    @IsString({ message: 'Birdhouse description must be a string' })
    @MinLength(1, { message: 'Birdhouse description is too short' })
    @MaxLength(255, { message: 'Birdhouse description is too long' })
      description: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Birdhouse size must be a number' })
      size: number;

    @IsArray({ message: 'Birdhouse pictures must be inside an array' })
    @IsUrl({}, { message: 'Birdhouse picture must be a valid URL', each: true })
      pictures: string[];

    @IsString({ each: true, message: 'Birdhouse style must be a string' })
    @MinLength(1, { each: true, message: 'Birdhouse style is too short' })
    @MaxLength(45, { each: true, message: 'Birdhouse style is too long' })
      styles: string[];
}
