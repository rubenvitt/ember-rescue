import { ToPathOption } from '@tanstack/react-router';
import React from 'react';
import { XOR } from './types/helper.js';

export type EinsatztagebuchEintragType =
  'GENERISCH' |
  'RESSOURCEN' |
  'KOMMUNIKATION' |
  'LAGE' |
  'PATIENTEN';

export type Bearbeiter = {
  id: string;
  name: string;
};


export type Einsatz = {
  id: string;
  beginn: string;
  ende: string | null;
  abgeschlossen: string | null;
  aufnehmendesRettungsmittelId: string;
  bearbeiterId: string;
  createdAt: string;
  updatedAt: string;
  einsatz_alarmstichwort?: {
    beschreibung: string;
    bezeichnung: string;
  };
};

export type NewBearbeiter = {
  name: string;
  id: null
}

export type WithIcon = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export type NavItem = {
  name: string;
  href: ToPathOption;
  current?: boolean;
} & WithIcon


export type EinsatztagebuchEintrag = IdentifiableWithTimestampAndBearbeiter & {
  bearbeiter: Bearbeiter;
  type: EinsatztagebuchEintragType;
  content: string;
  absender: string;
  empfaenger: string;
};

export type CreateEinsatztagebuchEintrag = Omit<EinsatztagebuchEintrag, 'id' | 'bearbeiter'>

export type NavItems = NavItem[]

export type DropdownItem = {
  name: string;
} & WithIcon & XOR<{
  onClick: () => void;
}, {
  href: ToPathOption;
}>

export type DropdownItems = DropdownItem[];

export type Identifiable = { id: string };
export type WithTimestamp = { timestamp: string };
export type WithBearbeiter = { bearbeiter: Bearbeiter };

export type IdentifiableWithTimestamp = Identifiable & WithTimestamp;
export type IdentifiableWithTimestampAndBearbeiter = Identifiable & WithTimestamp & WithBearbeiter;
export type IdentifiableLabel = Identifiable & { name: string };

export type BearbeiterDto = {
  id: string;
  name: string;
}

export type NewBearbeiterDto = Omit<BearbeiterDto, 'id'>;

export type QualifikationDto = {
  id: string
  bezeichnung: string
  abkuerzung: string
}

export type SmallStatusDto = {
  id: string
  code: string
  bezeichnung: string
}

export type StatusDto = SmallStatusDto & {
  beschreibung: string;
};

export type EinheitDto = {
  _count: {
    einsatz_einheit: number
  },
  id: string
  funkrufname: string
  typ: string
  kapazitaet: number
  istTemporaer: boolean
  status: SmallStatusDto
}
