import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IUser } from '../entities';
import { Roles } from '../types';

export class UserDto implements IUser {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsBoolean()
  @IsNotEmpty()
  isValidated: boolean;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsString({ each: true })
  roles: Array<Roles>;
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
  @IsDate()
  @IsString()
  @IsNotEmpty()
  birthdate: Date;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  postalCode: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  @IsDate()
  @IsString()
  @IsNotEmpty()
  updatedAt: Date;
  @IsDate()
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
  'postalCode',
  'isValidated',
] as const) {}

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, [
    'roles',
    'password',
    'username',
    'createdAt',
    'isValidated',
  ] as const),
) {}

export class SignInUserDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
