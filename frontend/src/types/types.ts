import { ToPathOption } from '@tanstack/react-router';
import React from 'react';
import { XOR } from './helper.js';
import { GrundzeichenId } from 'taktische-zeichen-core';

export type EinsatztagebuchEintragType =
  'USER' |
  'GENERISCH' |
  'RESSOURCEN' |
  'KOMMUNIKATION' |
  'LAGE' |
  'BETROFFENE';


export type Alarmstichwort = Identifiable & WithTimestamp & {
  bezeichnung: string, beschreibung: string
}

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
  icon: SVGComponent;
}

export type NavItem = {
  name: string;
  href: ToPathOption;
  current?: boolean;
} & WithIcon


export type EinsatztagebuchEintrag = IdentifiableWithTimestampAndBearbeiter & {
  bearbeiter: Bearbeiter;
  type?: EinsatztagebuchEintragType;
  content: string;
  archived: boolean;
  absender: string;
  empfaenger: string;
  createdAt: string;
};

export type CreateEinsatztagebuchEintrag = Omit<EinsatztagebuchEintrag, 'id' | 'bearbeiter' | 'archived' | 'createdAt'>

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

export type StatusCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'none';

export type SmallStatusDto = {
  id: string
  code: StatusCode
  bezeichnung: string
}

export type StatusDto = SmallStatusDto & {
  beschreibung: string;
};

export type SmallEinheitTypDto = {
  id: string
  label: string
}

export type EinheitDto = {
  _count: {
    einsatz_einheit: number
  },
  id: string
  funkrufname: string
  einheitTyp: SmallEinheitTypDto,
  kapazitaet: number
  istTemporaer: boolean
  status: SmallStatusDto
}

export type EinheitTypDto = {
  id: string
  description: string
  label: string
  grundzeichen: GrundzeichenId
}

export type ServerMetadata = { serverName: string, serverId: string, version: string }

export type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>