import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IUser } from '../entities';
import { Roles } from '../types';

export class UserDto implements IUser {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsBoolean()
  isValidated: boolean;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString({ each: true })
  roles: Array<Roles>;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  firstname: string;
  @IsNotEmpty()
  @IsString()
  lastname: string;
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  birthdate: Date;
  @IsNotEmpty()
  @IsString()
  address: string;
  @IsNotEmpty()
  @IsString()
  city: string;
  @IsNotEmpty()
  @IsString()
  country: string;
  @IsString()
  @IsNotEmpty()
  updatedAt: Date;
  @IsString()
  @IsNotEmpty()
  createdAt: Date;
}

export class CreateUserDto extends OmitType(UserDto, [
  'city',
  'roles',
  'phone',
  'address',
  'country',
  'birthdate',
  'updatedAt',
  'createdAt',
  'isValidated',
] as const) {}

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['createdAt'] as const),
) {}

export class SignInUserDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}

export class SafeUserDto extends OmitType(UserDto, ['password'] as const) {}
