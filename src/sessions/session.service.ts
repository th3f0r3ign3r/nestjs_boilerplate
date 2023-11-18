import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Session, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UAResult } from '@/lib/decorators';
import { createHash } from 'crypto';
import { getDateInFuture } from '../utils';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(
    sessionWhereUniqueInput: Prisma.SessionWhereUniqueInput,
  ): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: sessionWhereUniqueInput,
    });
  }

  async count(): Promise<number> {
    return this.prisma.session.count();
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SessionWhereUniqueInput;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }): Promise<Session[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.session.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(userAgent: UAResult, user: User): Promise<Session> {
    const { browser, ua, os, device } = userAgent;
    const accessToken = createHash('sha512')
      .update(JSON.stringify(user))
      .digest('hex');
    const sessionId = createHash('sha256')
      .update(JSON.stringify(userAgent))
      .digest('hex');
    const session = await this.prisma.session.create({
      data: {
        sessionId,
        accessToken,
        userAgent: ua,
        expires: getDateInFuture(10080), // 7 days,
        os: JSON.parse(JSON.stringify(os)),
        device: JSON.parse(JSON.stringify(device)),
        browser: JSON.parse(JSON.stringify(browser)),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return session;
  }

  async delete(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.delete({
      where,
    });
  }
}
