import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, Session, Status, User } from '@prisma/client';
import { UAResult } from '@/lib/decorators';
import { CreateUserDTO, VerifyAuthRequestDTO } from '@/lib/dto/user.dto';
import { MailService } from '@/mail/mail.service';
import { UsersService } from '@/users/users.service';
import { AuthRequestService } from '@/authRequests/authRequest.service';
import { SessionService } from '@/sessions/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRequestService: AuthRequestService,
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async validateToken({
    accessToken,
  }: Pick<Prisma.SessionWhereUniqueInput, 'accessToken'>): Promise<Session> {
    // Check if session exists
    const session = await this.sessionService.findUnique({
      accessToken,
    });

    // If session exists, return session
    if (session) return session;
    // Else throw error
    else throw new HttpException('AUTH.INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
  }

  async getUserInfoBySession(session: Session): Promise<User> {
    // Check if user exists
    const user = await this.usersService.findUnique({
      id: session.userId,
    });

    // If user exists, return user
    if (user) return user;
    // Else throw error
    else throw new HttpException('AUTH.INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
  }

  async getProfile(id: string): Promise<User> {
    return await this.usersService.findUnique({ id });
  }

  async register(payload: CreateUserDTO) {
    // Check if username or email already exists
    const isUserExists = await this.usersService.findFirst({
      where: {
        OR: [{ username: payload.username }, { email: payload.email }],
      },
    });

    // If user exists, throw error
    if (isUserExists) {
      throw new HttpException('AUTH.USER_ALREADY_EXISTS', HttpStatus.CONFLICT);
    } else {
      const user = await this.usersService.create(payload);
      if (user) return { message: 'AUTH.USER_REGISTERED' };
    }
  }

  async login(payload: Pick<CreateUserDTO, 'email'>) {
    // Check if user exists
    const user = await this.usersService.findUnique({
      email: payload.email,
    });

    // If user exists, throw error
    if (user) {
      // Check if user has an existing auth request
      const existingAuthRequest = await this.authRequestService.findUnique({
        userEmail: user.email,
      });
      if (existingAuthRequest)
        await this.authRequestService.deleteById(existingAuthRequest.id);

      // Create auth request for user
      const authRequest = await this.authRequestService.create(user);

      // Send email with auth request token
      if (authRequest) {
        const isMailSent = await this.mailService.sendVerifyEmail(
          authRequest.userEmail,
          authRequest.token,
        );
        if (isMailSent)
          throw new HttpException(
            {
              message: 'AUTH.LOGIN_INITIALISED',
              verifyLink: authRequest.identifier,
            },
            HttpStatus.CONTINUE,
          );
        else await this.authRequestService.deleteById(authRequest.id);
        throw new HttpException(
          'AUTH.LOGIN_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else
      throw new HttpException(
        'AUTH.INVALID_CREDENTIALS',
        HttpStatus.UNAUTHORIZED,
      );
  }

  async verifyRequest(payload: VerifyAuthRequestDTO, userAgent: UAResult) {
    // Check if auth request exists
    const authRequest = await this.authRequestService.findUnique(payload);

    // Check if user exists
    const user = await this.usersService.findUnique({
      email: payload.userEmail,
    });

    // Check if auth request and user exists
    if (authRequest && user) {
      // Check if request is expired
      if (authRequest.expires < new Date())
        throw new HttpException(
          'AUTH.REQUEST_TIMEOUT',
          HttpStatus.REQUEST_TIMEOUT,
        );

      // Update user status to verified if not verifiedƒ
      if (user.status === Status.CREATED)
        await this.usersService.update({
          where: {
            email: authRequest.userEmail,
          },
          data: {
            status: Status.VERIFIED,
          },
        });

      // Delete auth request
      await this.authRequestService.deleteById(authRequest.id);

      // Create session
      const session = await this.sessionService.create(userAgent, user);
      return {
        message: 'AUTH.VERIFICATION_SUCCESS',
        accessToken: session.accessToken,
        sessionId: session.sessionId,
      };
    } else {
      // If auth request or user not exists, throw error
      // Delete auth request if exists
      await this.authRequestService.deleteById(authRequest.id);
      throw new HttpException(
        'AUTH.VERIFICATION_ERROR',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async resendRequest(payload: { identifier: string }) {
    // Check if auth request exists
    const authRequest = await this.authRequestService.findUnique({
      identifier: payload.identifier,
    });

    // Check if user exists
    const user = await this.usersService.findUnique({
      email: authRequest.userEmail,
    });

    // If auth request exists, resend email
    if (authRequest && user && authRequest.expires > new Date()) {
      // If auth request is not expired, regenerate token
      const newRequest = await this.authRequestService.regenerate({
        where: {
          identifier: payload.identifier,
        },
        user: await this.usersService.findUnique({
          email: authRequest.userEmail,
        }),
      });

      // Send email with new token
      const isMailSent = await this.mailService.sendVerifyEmail(
        newRequest.userEmail,
        newRequest.token,
      );
      if (isMailSent)
        return {
          message: 'AUTH.VERIFICATION_RESENT',
        };
      else {
        await this.authRequestService.deleteById(newRequest.id);
        throw new InternalServerErrorException();
      }
    }
    throw new HttpException(
      'AUTH.VERIFICATION_RESENT_ERROR',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async getSessions(userId: string) {
    // Get sessions
    const sessions = await this.sessionService.findMany({
      where: {
        userId,
      },
    });
    // If sessions exists, return sessions
    if (sessions) return sessions;
    throw new HttpException('AUTH.SESSIONS_NOT_FOUND', HttpStatus.NOT_FOUND);
  }

  async getAuthRequestByIdentifier(identifier: string) {
    // Check if auth request exists
    const authRequest = await this.authRequestService.findUnique({
      identifier,
    });
    // If auth request exists, return auth request
    if (authRequest) return authRequest;
    throw new HttpException('AUTH.REQUEST_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
