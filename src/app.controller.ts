import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api/health', HttpStatus.MOVED_PERMANENTLY)
  root(): void {
    return;
  }

  @Get('health')
  getHealth(): { statusCode: number; message: string } {
    return { statusCode: HttpStatus.OK, message: 'API.ONLINE' };
  }
}
