import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ required: true })
  timestamp: Date;
  @Prop({})
  notified?: Date;
  @Prop({})
  read?: Date;

  @Prop({ required: true })
  title: string;
  @Prop({})
  content: string;

  @Prop({})
  action?: string;

  // TODO einsatz
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
