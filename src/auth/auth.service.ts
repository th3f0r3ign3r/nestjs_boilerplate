import {
  Injectable,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, SignInUserDto } from 'src/lib/dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createAccount(payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  async getProfile(uuid: ParseUUIDPipe) {
    return await this.usersService.findByUuid(uuid);
  }

  async login(payload: SignInUserDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne({ email: payload.email });

    if (!user || !bcrypt.compareSync(payload.password, user.password))
      throw new UnauthorizedException('USER.ERROR.LOGIN_FAILED');

    return {
      access_token: this.jwtService.sign({
        uuid: user.uuid,
        roles: user.roles,
      }),
    };
  }
}
