import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';


@Controller('ping')
export class PingController {
  @Get()
  ping(@Res() response: Response) {
    response.send({
      message: 'pong',
    });
  }
}
