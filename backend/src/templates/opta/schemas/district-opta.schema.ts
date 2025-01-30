import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseOptaTemplate } from './base-opta.schema';

@Schema({ discriminatorKey: 'type' })
export class DistrictOptaTemplate extends BaseOptaTemplate {}

export const DistrictOptaSchema =
  SchemaFactory.createForClass(DistrictOptaTemplate);
