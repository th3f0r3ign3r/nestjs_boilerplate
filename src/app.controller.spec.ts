import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HttpStatus } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return an object with statusCode 200 and message "API.IS.ONLINE"', () => {
      const response = appController.getHealth();
      expect(response).toHaveProperty('statusCode', HttpStatus.OK);
      expect(response).toHaveProperty('message', 'API.IS.ONLINE');
    });
  });
});
