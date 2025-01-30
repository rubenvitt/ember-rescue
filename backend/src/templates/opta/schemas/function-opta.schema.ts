import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseOptaTemplate } from '@templates/opta/schemas/base-opta.schema';
import { FunctionGroup } from '@templates/opta/constants';

@Schema()
export class FunctionOptaTemplate extends BaseOptaTemplate {
  @Prop({ required: true, type: String, enum: FunctionGroup })
  group: FunctionGroup;
}

export const FunctionOptaSchema =
  SchemaFactory.createForClass(FunctionOptaTemplate);
