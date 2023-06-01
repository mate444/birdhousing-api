import {
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
  IsStrongPassword
} from "class-validator";

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
