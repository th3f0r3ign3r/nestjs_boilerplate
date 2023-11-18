import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AuthRequest, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { getDateInFuture } from '../utils';

@Injectable()
export class AuthRequestService {
  constructor(private readonly prisma: PrismaService) {}

  private generateToken(user: User): string {
    return createHash('sha256')
      .update(
        JSON.stringify(user) +
          '&&.///.&&' +
          Math.floor(100000 + Math.random() * 900000).toString(),
      )
      .digest('hex');
  }

  async findUnique(
    authRequestWhereUniqueInput: Prisma.AuthRequestWhereUniqueInput,
  ): Promise<AuthRequest | null> {
    return this.prisma.authRequest.findUnique({
      where: authRequestWhereUniqueInput,
    });
  }

  async count(): Promise<number> {
    return this.prisma.authRequest.count();
  }

  async create(user: User): Promise<AuthRequest> {
    // Generate token
    const token = this.generateToken(user);

    // Create auth request
    return this.prisma.authRequest.create({
      data: {
        token,
        expires: getDateInFuture(15),
        user: {
          connect: {
            email: user.email,
          },
        },
      },
    });
  }

  async regenerate(params: {
    where: Prisma.AuthRequestWhereUniqueInput;
    user: User;
  }): Promise<AuthRequest> {
    const { where, user } = params;
    const token = this.generateToken(user);
    return this.prisma.authRequest.update({
      where,
      data: {
        token,
        expires: getDateInFuture(15),
      },
    });
  }

  async delete(
    where: Prisma.AuthRequestWhereUniqueInput,
  ): Promise<AuthRequest> {
    return this.prisma.authRequest.delete({
      where,
    });
  }

  async deleteById(
    id: Prisma.AuthRequestWhereUniqueInput['id'],
  ): Promise<AuthRequest> {
    return this.prisma.authRequest.delete({
      where: {
        id,
      },
    });
  }
}
