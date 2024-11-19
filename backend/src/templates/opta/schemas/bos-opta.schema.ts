import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseOptaTemplate } from '@templates/opta/schemas/base-opta.schema';
import { BosGroup } from '@templates/opta/constants';

@Schema()
export class BosOptaTemplate extends BaseOptaTemplate {
  @Prop({ required: true, type: String, enum: BosGroup })
  group: BosGroup;

  @Prop({ required: true })
  rufname: string;
}

export const BosOptaSchema = SchemaFactory.createForClass(BosOptaTemplate);
