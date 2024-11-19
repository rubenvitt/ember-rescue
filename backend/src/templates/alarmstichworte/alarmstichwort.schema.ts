import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TemplateDocument } from '@core/database/base-documents';

export class AlarmstichwortDto {
  code: string;
  description: string;
}

@Schema({ timestamps: true, collection: 'alarmstichworte' })
export class Alarmstichwort extends TemplateDocument {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  description: string;
}

let schema = SchemaFactory.createForClass(Alarmstichwort);

schema.index({ code: 1 }, { unique: true });
schema.index({ description: 1 }, { unique: true });

export const AlarmstichwortSchema = schema;
