import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseOptaTemplate } from '@templates/opta/schemas/base-opta.schema';
import { LocalGroup } from '@templates/opta/constants';

@Schema()
export class LocalCodeOptaTemplate extends BaseOptaTemplate {
  @Prop({ required: true, type: String, enum: LocalGroup })
  group: LocalGroup;
}

export const LocalCodeOptaSchema = SchemaFactory.createForClass(
  LocalCodeOptaTemplate,
);
