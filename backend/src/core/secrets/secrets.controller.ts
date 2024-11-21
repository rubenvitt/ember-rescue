import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';

interface SecretDto {
  key: string;
  value: string | null;
}

@Controller('secrets')
@UseGuards(BearbeiterGuard)
export class SecretsController {
  private readonly logger = new Logger(SecretsController.name);

  constructor(private readonly secretsService: SecretsService) {}

  @Get(':secret')
  async readSecret(@Param('secret') key: string): Promise<SecretDto> {
    return { value: await this.secretsService.read(key), key };
  }

  // generate post new secrets
  @Post()
  createSecret(@Body() secret: SecretDto) {
    this.logger.log('Post secret', secret.key);
    return this.secretsService.save(secret.key, secret.value);
  }
}
