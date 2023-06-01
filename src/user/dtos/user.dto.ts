import {
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
  IsStrongPassword,
  IsUUID,
  IsEnum
} from "class-validator";
import { UserStatusEnum } from "../interfaces/user.interface";

export class CreateUserDto {
  @IsString()
  @MinLength(1, {
    message: 'User Name is too short'
  })
  @MaxLength(30, {
    message: 'User Name is too long'
  })
    name: string;

  @IsString()
  @MinLength(1, {
    message: 'User Lastname is too short'
  })
  @MaxLength(30, {
    message: 'User Lastname is too long'
  })
    lastname: string;

  @MaxLength(255, {
    message: 'User email is too long'
  })
  @IsEmail()
    email: string;

  @IsString()
  @IsStrongPassword()
    password: string;
}

export class DeleteUserDto {
  @IsString()
  @IsUUID(4, { message: 'User id must be a V4 UUID' })
    id: string;

  @IsString()
  @IsEnum(UserStatusEnum, { message: 'User status is incorrect' })
    status: string;
}

export class UserLoginDto {
  @IsEmail()
    email: string;

  @IsString()
  @IsStrongPassword()
    password: string;
}

export class UserUpdateDto {
  @IsString()
  @IsUUID(4, { message: 'User id must be a V4 UUID' })
    id: string;

  @MinLength(1, {
    message: 'User Name is too short'
  })
  @MaxLength(30, {
    message: 'User Name is too long'
  })
    name: string;

  @IsString()
  @MinLength(1, {
    message: 'User Lastname is too short'
  })
  @MaxLength(30, {
    message: 'User Lastname is too long'
  })
    lastname: string;
}
