import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Bearbeiter } from '../../user/bearbeiter/core/bearbeiter.schema';
import { Einsatz } from '../schema/einsatz.schema';

@Schema({ timestamps: true, collection: 'notizen' })
export class Notiz extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  doneAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ required: true, type: String })
  bearbeiterId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Bearbeiter.name,
  })
  bearbeiter: Bearbeiter;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Einsatz.name,
  })
  einsatz: Einsatz;

  // TODO reminder
}

export const NotizSchema = SchemaFactory.createForClass(Notiz);
