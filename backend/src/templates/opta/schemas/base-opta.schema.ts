import { TemplateDocument } from '@core/database';
import { Prop, Schema } from '@nestjs/mongoose';
import { OptaType } from '@templates/opta/constants';

@Schema({
  discriminatorKey: 'type',
  collection: 'opta-templates',
  timestamps: true,
})
export class BaseOptaTemplate extends TemplateDocument {
  @Prop({ required: true, index: true })
  code: string;

  @Prop({ required: true })
  label: string;

  type: OptaType;

  @Prop()
  description?: string;
}
