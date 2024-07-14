import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class MetaService {
  private serverId: string;

  constructor(private readonly configService: ConfigService) {
    this.serverId = createId();
  }

  findAppMetadata() {
    return {
      version: this.configService.get<string>('VERSION') ?? '0.0.0-development',
      serverName: this.configService.getOrThrow<string>('SERVER_NAME'),
      serverId: this.serverId,
    };
  }
}
