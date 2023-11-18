import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Role, Status, User, AuthRequest } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserDTO implements User {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  profile: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date;
}

export class CreateUserDTO extends OmitType(UserDTO, [
  'createdAt',
  'updatedAt',
  'profile',
  'status',
  'role',
  'id',
]) {}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class AuthRequestDTO implements AuthRequest {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDateString()
  @IsNotEmpty()
  expires: Date;

  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date;
}

export class VerifyAuthRequestDTO extends OmitType(AuthRequestDTO, [
  'id',
  'expires',
  'createdAt',
  'updatedAt',
]) {}
