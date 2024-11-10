import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import {
  BosOptaEntry,
  DistrictOptaEntry,
  FunctionOptaEntry,
  LocalCodeOptaEntry,
  OptaTpyesObj,
  OptaTypes,
} from './opta/entry.schema';

export type OptaType = keyof OptaTypes;

@Schema({ timestamps: true })
export class Opta extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: OptaTpyesObj.DISTRICT,
  })
  district: DistrictOptaEntry;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: OptaTpyesObj.BOS_CODE,
  })
  bosCode: BosOptaEntry;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: OptaTpyesObj.LOCAL_CODE,
  })
  localCode: LocalCodeOptaEntry;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: OptaTpyesObj.FUNCTION_CODE,
  })
  functionCode: FunctionOptaEntry;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  ort: string;

  @Prop()
  supplement?: string;

  @Prop({ unique: true })
  fullOpta: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const OptaSchema = SchemaFactory.createForClass(Opta);

// Automatische Generierung der fullOpta
OptaSchema.pre('save', function (next) {
  if (
    this.isModified('ort') ||
    this.isModified('bosCode') ||
    this.isModified('district') ||
    this.isModified('localCode') ||
    this.isModified('functionCode') ||
    this.isModified('orderNumber')
  ) {
    // [DISTRICT] [BOS] [LOCAL_CODE]-[FUNCTION_CODE]-orderNumber
    this.fullOpta = `${this.district.code} ${this.bosCode.code} ${this.ort} ${this.localCode.code}-${this.functionCode.code}-${this.orderNumber}`;
  }
  next();
});
