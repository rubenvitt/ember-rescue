import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class AlarmstichwortDto {}

@Schema({ timestamps: true, collection: 'alarmstichworte' })
export class Alarmstichwort extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  description: string;
}

export const AlarmstichwortSchema =
  SchemaFactory.createForClass(Alarmstichwort);
