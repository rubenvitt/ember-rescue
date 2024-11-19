import { Injectable } from '@nestjs/common';
import { JSONSchemaType } from 'ajv';
import { StatusDto } from '@templates/status/status.schema';
import { StatusRepository } from '@templates/status/status.repository';

@Injectable()
export class StatusService {
  constructor(private readonly repository: StatusRepository) {}

  findAll() {
    return this.repository.findActive();
  }

  findStatusByCode(code: number) {
    return this.repository.findActiveByCode(code);
  }

  findStatusById(id: string) {
    return this.repository.findActiveById(id);
  }

  getSchema(): JSONSchemaType<StatusDto[]> {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', pattern: '^[0-9]$' },
          label: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['code', 'label', 'description'],
      },
    };
  }
}
