import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
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
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date;
}

export class CreateUserDTO extends OmitType(UserDTO, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
