import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { CustomStrategy } from '@/lib/strategies';
import { UsersService } from '@/users/users.service';
import { SessionService } from '@/sessions/session.service';
import { AuthRequestService } from '@/authRequests/authRequest.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    CustomStrategy,
    AuthRequestService,
    SessionService,
    UsersService,
  ],
})
export class AuthModule {}
