import { Get, Res } from '@nestjs/common';
import { Response } from 'express';

export class PingController {
  @Get()
  ping(@Res() response: Response) {
    response.send({
      message: 'pong',
    });
  }
}
