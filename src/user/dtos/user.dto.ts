import {
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
  IsStrongPassword,
  IsUUID,
  IsEnum,
  IsPhoneNumber
} from "class-validator";
import { IsCountry } from "../../common/validateCountry";
import { UserStatusEnum } from "../interfaces/user.interface";

export class CreateUserDto {
  @IsString()
  @IsCountry()
    country: string;

  @MaxLength(255, {
    message: 'User email is too long'
  })
  @IsEmail()
    email: string;

  @IsString()
  @IsStrongPassword({ minNumbers: 1, minLength: 8, minSymbols: 1 })
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
  @IsStrongPassword({ minNumbers: 1, minLength: 8, minSymbols: 1 })
    password: string;
}

export class UserUpdateDto {
  @IsString()
  @IsUUID(4, { message: 'User id must be a V4 UUID' })
    id: string;

  @IsString()
  @IsCountry()
    country: string;
}

export class UserUpdatePasswordDto {
  @IsEmail()
    email: string;

  @IsString()
  @IsStrongPassword({ minNumbers: 1, minLength: 8, minSymbols: 1 })
    password: string;

  @IsString()
  @IsStrongPassword({ minNumbers: 1, minLength: 8, minSymbols: 1 })
    newPassword: string;
}

class BaseUserAddressDto {
  @MinLength(1, {
    message: 'Name is too short'
  })
  @MaxLength(30, {
    message: 'Name is too long'
  })
    name: string;

  @IsString()
  @MinLength(1, {
    message: 'Lastname is too short'
  })
  @MaxLength(30, {
    message: 'Lastname is too long'
  })
    lastname: string;

  @IsString()
  @MinLength(1, {
    message: 'User address is too short'
  })
  @MaxLength(100, {
    message: 'User address is too long'
  })
    address: string;

  @IsString()
  @IsCountry({
    message: 'Invalid User address country'
  })
    country: string;

  @IsString()
  @MinLength(1, {
    message: 'User address city is too short'
  })
  @MaxLength(50, {
    message: 'User address city is too long'
  })
    city: string;

  @IsString()
  @MinLength(1, {
    message: 'User address postalCode is too short'
  })
  @MaxLength(20, {
    message: 'User address postalCode is too long'
  })
    postalCode: string;

  @IsString()
  @IsPhoneNumber(null, { message: 'Invalid User address phone number' })
    phoneNumber: string;
}

export class UserAddressCreateDto extends BaseUserAddressDto {
    @IsString()
    @IsUUID(4, { message: 'User id must be a V4 UUID' })
      userId: string;
}
