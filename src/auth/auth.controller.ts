import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UA, UAResult, USER } from '@/lib/decorators';
import { AuthTokenGuard } from '@/lib/guards';
import { CreateUserDTO, VerifyAuthRequestDTO } from '@/lib/dto/user.dto';
import { omitObjectKeys } from '@/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: Pick<CreateUserDTO, 'email'>) {
    return await this.authService.login(body);
  }

  @Post('login/verify')
  async verify(@Body() body: VerifyAuthRequestDTO, @UA() ua: UAResult) {
    return await this.authService.verifyRequest(body, ua);
  }

  @Post('login/resend')
  async resendOtp(@Body() body: Required<{ identifier: string }>) {
    return await this.authService.resendRequest(body);
  }

  @Get('request/:identifier')
  async getAuthRequestByIdentifier(@Param('identifier') identifier: string) {
    const request =
      await this.authService.getAuthRequestByIdentifier(identifier);
    return omitObjectKeys(request, ['token', 'createdAt', 'id', 'updatedAt']);
  }

  @Get('me')
  @UseGuards(AuthTokenGuard)
  async getProfile(@USER('id') id: string) {
    return await this.authService.getProfile(id);
  }

  @Get('me/sessions')
  @UseGuards(AuthTokenGuard)
  async getSessions(@USER('id') id: string) {
    return await this.authService.getSessions(id);
  }
}
