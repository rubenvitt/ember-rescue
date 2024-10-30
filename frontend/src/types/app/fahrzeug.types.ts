import { SmallStatusDto } from './status.types.js';
import { GrundzeichenId } from 'taktische-zeichen-core';
import { Identifiable } from '../utils/common.types.js';

export type FahrzeugDto = Identifiable & {
  _count: {
    einsatz_fahrzeug: number;
  };
  funkrufname: string;
  optaOrt: {
    code: number;
    label: string;
  } | null;
  optaFunktion: {
    code: number;
    label: string;
    einheit: string;
    fachaufgabe: string;
    funktion: string;
    grundzeichen: string;
    organisation: string;
    verwaltungsstufe: string;
    symbol: string;
  } | null;
  optaOrdnung: number | null;
  kapazitaet: number;
  istTemporaer: boolean;
  status: SmallStatusDto;
};

/**
 * @deprecated
 * @since 2024-10-26
 */
export type FahrzeugTypDto = Identifiable & {
  description: string;
  label: string;
  grundzeichen: GrundzeichenId;
};
