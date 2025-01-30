import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TemplateDocument } from '@core/database';

@Schema({ collection: 'status' })
export class Status extends TemplateDocument {
  @Prop({ required: true, unique: true })
  code: number;

  @Prop({ required: true, unique: true })
  label: string;

  @Prop({ required: true, unique: true })
  description: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

/**
 * @deprecated
 */
export type StatusDto = {
  code: number;
  label: string;
  description: string;
};
