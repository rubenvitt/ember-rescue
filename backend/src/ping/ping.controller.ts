import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SkipCache } from '@core/interceptors/cache.interceptor';

@Controller('ping')
export class PingController {
  @Get()
  @SkipCache()
  ping(@Res() response: Response) {
    response.send({
      message: 'pong',
    });
  }
}
