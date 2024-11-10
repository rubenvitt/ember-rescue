import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'status' })
export class Status extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  label: string;

  @Prop({ required: true, unique: true })
  description: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

export type StatusDto = {
  code: string;
  label: string;
  description: string;
};
