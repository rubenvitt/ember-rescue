import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  FachaufgabeId,
  OrganisationId,
  VerwaltungsstufeId,
} from 'taktische-zeichen-core';
import { BaseOptaTemplate } from '@templates/opta/schemas/base-opta.schema';

// TODO: remove this:
export type FahrzeugIconDefinitionDto = {
  organisation: OrganisationId;
  fachaufgabe: FachaufgabeId;
  verwaltungsstufe: VerwaltungsstufeId;
};

// TODO: noch richtig so?
@Schema()
class FahrzeugIconDefinition {
  @Prop()
  organisation: string;
  @Prop()
  fachaufgabe: string;
  @Prop()
  verwaltungsstufe: string;
}

@Schema({ timestamps: true, collection: 'fahrzeug-templates' })
export class FahrzeugTemplate extends BaseOptaTemplate {
  @Prop({ required: true })
  fullOpta: string;

  @Prop()
  iconDefinition: FahrzeugIconDefinition;

  @Prop()
  kapazitaet?: number;
}

export const FahrzeugTemplateSchema =
  SchemaFactory.createForClass(FahrzeugTemplate);
