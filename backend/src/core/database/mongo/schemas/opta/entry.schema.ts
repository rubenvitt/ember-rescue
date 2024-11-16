// base-opta-entry.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OptaType } from '../opta.schema';
import { DocumentStatus } from '../../common/types';

// NI Florian Uelzen 40-83-1
export type OptaTypes = {
  DISTRICT: 'DISTRICT';
  BOS_CODE: 'BOS_CODE'; // FW, DRK, etc. als BOS-Code
  LOCAL_CODE: 'LOCAL_CODE'; // Örtliche Kennungen
  FUNCTION_CODE: 'FUNCTION_CODE'; // Fahrzeug/Funktionskennungen
  SHORT_NAME: 'SHORT_NAME'; // Kurzbezeichnungen TODO z.B. Gruppenführer Sanität oder so
};

// [DISTRICT] [BOS] [LOCAL_CODE]-[FUNCTION_CODE]-orderNumber

export const OptaTpyesObj: OptaTypes = {
  DISTRICT: 'DISTRICT',
  FUNCTION_CODE: 'FUNCTION_CODE',
  BOS_CODE: 'BOS_CODE',
  LOCAL_CODE: 'LOCAL_CODE',
  SHORT_NAME: 'SHORT_NAME',
};

@Schema({
  timestamps: true,
  discriminatorKey: 'type',
  typeKey: 'type',
  collection: 'opta_entries',
})
export class BaseOptaEntry extends Document {
  static mongoName = 'OptaEntry';
  @Prop({
    required: true,
  })
  code: string;
  @Prop({
    required: true,
  })
  label: string;
  @Prop({ default: DocumentStatus.ACTIVE, required: true })
  status: DocumentStatus;
  @Prop({ default: new Date() })
  validFrom?: Date;
  @Prop()
  validTo?: Date;
}

@Schema({
  collection: 'opta_entries',
})
export class SimpleOptaEntry extends BaseOptaEntry {
  @Prop({ required: false })
  description?: string;
}

@Schema({
  collection: 'opta_entries',
})
export class FunctionOptaEntry extends SimpleOptaEntry {
  @Prop({
    required: true,
    index: true,
  })
  group: string;
}

@Schema({
  collection: 'opta_entries',
})
export class BosOptaEntry extends SimpleOptaEntry {
  @Prop({
    required: true,
    index: true,
  })
  group: string;

  @Prop({
    required: true,
  })
  rufname: string;
}

@Schema()
export class DistrictOptaEntry extends BaseOptaEntry {}

@Schema()
export class LocalCodeOptaEntry extends BaseOptaEntry {
  @Prop({
    required: true,
    index: true,
  })
  group: string;
}

export type BaseOptaEntryDto = Pick<
  BaseOptaEntry,
  'code' | 'label' | 'validTo' | 'validFrom'
>;

export type SimpleOptaEntryDto = BaseOptaEntryDto &
  Pick<SimpleOptaEntry, 'description'> & {
    type: OptaType;
  };

export type FunctionOptaEntryDto = SimpleOptaEntryDto & {
  group: string;
  type: 'FUNCTION_CODE';
};

export type BosOptaEntryDto = SimpleOptaEntryDto & {
  type: 'BOS_CODE';
  group: string;
  rufname: string;
};

export type DistrictEntryDto = BaseOptaEntryDto & {
  type: 'DISTRICT';
};

export type LocalCodeEntryDto = BosOptaEntryDto & {
  type: 'LOCAL_CODE';
  group: string;
};

const _BaseOptaEntrySchema = SchemaFactory.createForClass(BaseOptaEntry);
const simpleOptaEntry = SchemaFactory.createForClass(SimpleOptaEntry);
const functionOptaEntrySchema = SchemaFactory.createForClass(FunctionOptaEntry);
const bosOptaEntrySchema = SchemaFactory.createForClass(BosOptaEntry);

_BaseOptaEntrySchema.index({ code: 1, type: 1 }, { unique: true });
_BaseOptaEntrySchema.pre('save', function (next) {
  const allowedTypes: OptaType[] = ['DISTRICT', 'FUNCTION_CODE', 'BOS_CODE']; // Add other allowed types here
  if (!allowedTypes.includes(this['type'])) {
    return next(
      new Error(
        `Invalid type: ${this['type']}. Type must be one of '${allowedTypes.join("', '")}'.`,
      ),
    );
  }

  next();
});

_BaseOptaEntrySchema.discriminator(
  OptaTpyesObj.LOCAL_CODE,
  SchemaFactory.createForClass(LocalCodeOptaEntry),
);
_BaseOptaEntrySchema.discriminator(
  OptaTpyesObj.FUNCTION_CODE,
  functionOptaEntrySchema,
);
_BaseOptaEntrySchema.discriminator(OptaTpyesObj.BOS_CODE, bosOptaEntrySchema);
_BaseOptaEntrySchema.discriminator(
  OptaTpyesObj.DISTRICT,
  SchemaFactory.createForClass(DistrictOptaEntry),
);

export const BaseOptaEntrySchema = _BaseOptaEntrySchema;
