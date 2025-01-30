import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Counter {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 100 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
mongoose.model(Counter.name, CounterSchema);
