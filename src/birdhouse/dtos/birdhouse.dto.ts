import {
  MinLength,
  MaxLength,
  IsInt,
  IsString,
  IsArray,
  IsOptional,
  IsNumber
} from "class-validator";
import { isFile } from "../../common/validateFile";
import { Express } from 'express';

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

  @IsOptional()
  @IsArray({ message: 'Birdhouse pictures must be inside an array' })
  @isFile({
    mime: ['image/jpeg', 'image/jpg', 'image/png']
  }, {
    each: true, message: 'Birdhouse picture must be [image/jpeg, image/jpg, image/png]'
  })
    pictures: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };

  @IsArray()
  @IsString({ each: true, message: 'Birdhouse color must be a string' })
  @MinLength(1, { each: true, message: 'Birdhouse color is too short' })
  @MaxLength(20, { each: true, message: 'Birdhouse color is too long' })
    colors: string[];

  @IsArray()
  @IsString({ each: true, message: 'Birdhouse style must be a string' })
  @MinLength(1, { each: true, message: 'Birdhouse style is too short' })
  @MaxLength(45, { each: true, message: 'Birdhouse style is too long' })
    styles: string[];
}
