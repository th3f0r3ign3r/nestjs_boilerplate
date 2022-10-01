import { JwtAuthGuard } from './../lib/guards/index';
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
import { serializeUser } from 'src/lib/types';

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user._id);
    return serializeUser(user);
  }
}
