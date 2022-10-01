import { ParseUUIDPipe } from '@nestjs/common';
import { Document } from 'mongoose';
import { Roles } from '../types';

export interface IUser {
  uuid: ParseUUIDPipe;

  email: string;
  username: string;
  firstname: string;
  lastname: string;
  roles: Array<Roles>;
  password: string;

  isValidated: boolean;

  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  birthdate: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = IUser & Document;
