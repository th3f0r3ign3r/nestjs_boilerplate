import { JwtAuthGuard, RolesGuard } from './../lib/guards/index';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from 'src/lib/dto';
import { AuthService } from './auth.service';
import { Roles } from 'src/lib/decorators/roles.decorator';
import { Roles as Role } from '../lib/types';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    return this.authService.createAccount(payload);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() payload: SignInUserDto) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('me')
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user._id);
  }
}
