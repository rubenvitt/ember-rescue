import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { JSONSchemaType } from 'ajv';
import { StatusDto } from '../database/mongo/schemas/status.schema';

@Injectable()
export class StatusService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.status.findMany();
  }

  findStatusByCode(code: number) {
    return this.prismaService.status.findUnique({
      where: {
        code: String(code),
      },
    });
  }

  findStatusById(id: string) {
    return this.prismaService.status.findUnique({
      where: {
        id,
      },
    });
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
