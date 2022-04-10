import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiBearerAuth()
  getHello() {
    return {
      message: 'Hello World!',
    };
  }
}
