import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHealth()).toBe({
        statusCode: HttpStatus.OK,
        message: 'API.ONLINE',
      });
    });
  });
});
