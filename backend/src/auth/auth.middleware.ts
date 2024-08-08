import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    const token = req.headers['authorization'];
    if (token) {
      (req as any).accessToken = token.split(' ')[1];
    }
    next();
  }
}
