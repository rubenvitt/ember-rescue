import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from '../config/configuration';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredToken = this.configService.get<string>(config.authToken);
    if (!requiredToken) {
      return true; // No token -> access allowed
    }

    const request = context.switchToHttp().getRequest();
    const token = request.accessToken;

    if (!token) {
      throw new UnauthorizedException('Missing Authorization Token');
    }

    if (token !== requiredToken) {
      throw new UnauthorizedException('Wrong Authorization Token');
    }

    return true;
  }
}
