import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    // Get token from headers
    const accessToken = req.headers['x-auth-token'];

    if (!accessToken) throw new ForbiddenException('AUTH.FORBIDDEN_ACCESS');

    // Check if tokens are valid
    const tokenInfo = await this.authService.validateToken({ accessToken });

    // Check if tokens are expired
    if (tokenInfo.expires.getTime() < Date.now())
      throw new UnauthorizedException('AUTH.TOKEN_EXPIRED');

    // If tokens are valid, return user
    if (tokenInfo) {
      const user = await this.authService.getUserInfoBySession(tokenInfo);
      if (user) return user;
    }
  }
}
