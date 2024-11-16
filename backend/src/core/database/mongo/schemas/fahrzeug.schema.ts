import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  FachaufgabeId,
  OrganisationId,
  VerwaltungsstufeId,
} from 'taktische-zeichen-core';

export type FahrzeugIconDefinitionDto = {
  organisation: OrganisationId;
  fachaufgabe: FachaufgabeId;
  verwaltungsstufe: VerwaltungsstufeId;
};

@Schema()
class FahrzeugIconDefinition {
  @Prop()
  organisation: string;
  @Prop()
  fachaufgabe: string;
  @Prop()
  verwaltungsstufe: string;
}

@Schema({ timestamps: true, collection: 'fahrzeuge' })
export class Fahrzeug {
  @Prop({ required: true })
  fullOpta: string;

  @Prop()
  iconDefinition: FahrzeugIconDefinition;

  @Prop()
  kapazitaet?: number;
}

export const FahrzeugSchema = SchemaFactory.createForClass(Fahrzeug);
