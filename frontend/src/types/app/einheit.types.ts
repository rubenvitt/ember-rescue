import { SmallStatusDto } from './status.types.js';
import { GrundzeichenId } from 'taktische-zeichen-core';
import { Identifiable } from '../utils/common.types.js';

export type EinheitType = Identifiable & {
  id: string
  label: string
}

export type EinheitDto = Identifiable & {
  _count: {
    einsatz_einheit: number
  },
  funkrufname: string
  einheitTyp: EinheitType,
  kapazitaet: number
  istTemporaer: boolean
  status: SmallStatusDto
}

export type EinheitTypDto = Identifiable & {
  description: string
  label: string
  grundzeichen: GrundzeichenId
}