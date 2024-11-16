import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class AlarmstichwortDto {
  code: string;
  description: string;
}

@Schema({ timestamps: true, collection: 'alarmstichworte' })
export class Alarmstichwort extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  description: string;
}

let schema = SchemaFactory.createForClass(Alarmstichwort);

schema.index({ code: 1 }, { unique: true });
schema.index({ description: 1 }, { unique: true });

export const AlarmstichwortSchema = schema;
