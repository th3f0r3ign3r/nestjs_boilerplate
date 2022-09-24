import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): { [key: string]: string | number } {
    return { status: HttpStatus.OK, message: 'API is working !' };
  }
}
