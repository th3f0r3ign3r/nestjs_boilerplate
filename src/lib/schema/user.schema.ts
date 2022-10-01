import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v1 as uuidv1 } from 'uuid';
import { IUser } from '../entities';
import { Roles } from '../types';

@Schema()
export class User implements IUser {
  @Prop({
    required: true,
    unique: true,
    default: uuidv1({
      msecs: new Date().getMilliseconds(),
    }),
  })
  uuid: string;

  @Prop({ required: true, unique: true })
  username: string;
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;
  @Prop()
  birthdate: Date;

  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ default: false })
  isValidated: boolean;
  @Prop()
  phone: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: Roles.USER })
  roles: Array<Roles>;

  @Prop()
  address: string;
  @Prop()
  city: string;
  @Prop()
  postalCode: string;
  @Prop()
  country: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
