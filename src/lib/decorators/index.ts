import { Role, User } from '@prisma/client';
import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { UAParser as uaParser } from 'ua-parser-js';
import type UAParser from 'ua-parser-js';

export const ROLES_KEY = 'role';
export const ACCESS = (...role: Role[]) => SetMetadata(ROLES_KEY, role);

export const USER = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;
    return data ? user?.[data] : user;
  },
);

export type UAResult = UAParser.IResult;

export const UA = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const ua: string = request.headers['user-agent'];
  const parser = new uaParser(ua);
  const result = parser.getResult();
  return result;
});
