import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDocument } from 'src/lib/entities';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(data: Partial<UserDocument>): Promise<Partial<UserDocument>> {
    const user = await this.usersService.findByUuid(data.uuid);

    if (!user) throw new UnauthorizedException('Invalid Token');

    return data;
  }
}
