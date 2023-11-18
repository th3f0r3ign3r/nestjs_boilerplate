import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): { statusCode: number; message: string } {
    return { statusCode: HttpStatus.OK, message: 'API.IS.ONLINE' };
  }
}
