import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createId } from '@paralleldrive/cuid2';
import * as packageJson from '../../../package.json';

@Injectable()
export class MetaService {
  private readonly serverId: string;

  constructor(private readonly configService: ConfigService) {
    this.serverId = createId();
  }

  findAppMetadata() {
    return {
      version: packageJson.version,
      serverName: this.configService.getOrThrow<string>('SERVER_NAME'),
      serverId: this.serverId,
    };
  }
}
