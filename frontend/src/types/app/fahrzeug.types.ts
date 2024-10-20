import { SmallStatusDto } from './status.types.js';
import { GrundzeichenId } from 'taktische-zeichen-core';
import { Identifiable } from '../utils/common.types.js';

export type FahrzeugType = Identifiable & {
  id: string;
  label: string;
};

export type FahrzeugDto = Identifiable & {
  _count: {
    einsatz_fahrzeug: number;
  };
  funkrufname: string;
  fahrzeugTyp: FahrzeugType;
  kapazitaet: number;
  istTemporaer: boolean;
  status: SmallStatusDto;
};

export type FahrzeugTypDto = Identifiable & {
  description: string;
  label: string;
  grundzeichen: GrundzeichenId;
};
