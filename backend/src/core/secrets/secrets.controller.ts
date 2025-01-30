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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SecretsDto, SecretsResponse } from '@core/secrets/secrets.dto';

@Controller('core/secrets')
@UseGuards(BearbeiterGuard)
export class SecretsController {
  private readonly logger = new Logger(SecretsController.name);

  constructor(private readonly secretsService: SecretsService) {}

  @Get(':secret')
  @ApiTags('Secrets')
  @ApiOperation({ summary: 'Read a secrets value' })
  @ApiOkResponse({
    type: SecretsResponse,
  })
  @ApiBearerAuth('Bearbeiter')
  async readSecret(@Param('secret') key: string): Promise<SecretsDto> {
    return { value: await this.secretsService.read(key), key };
  }

  // generate post new secrets
  @Post()
  @ApiTags('Secrets')
  @ApiOperation({ summary: 'Create a new secrets' })
  @ApiBearerAuth('Bearbeiter')
  @ApiOkResponse({
    type: SecretsResponse,
    description: 'The created secret',
  })
  @ApiBody({
    type: SecretsDto,
  })
  createSecret(@Body() secret: SecretsDto) {
    this.logger.log('Post secret', secret.key);
    return this.secretsService.save(secret.key, secret.value);
  }
}
