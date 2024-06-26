import { ToPathOption } from '@tanstack/react-router';
import { EinsatztagebuchEintragType } from '@common-dtos/einsatztagebuch.dto';

export type Bearbeiter = {
  id: string;
  name: string;
};

export type NewBearbeiter = {
  name: string;
  id: null
}

export type NavItem = {
  name: string;
  href: ToPathOption;
}

export type EinsatztagebuchEintrag = IdentifiableWithTimestampAndBearbeiter & {
  bearbeiter: Bearbeiter;
  type: EinsatztagebuchEintragType;
  content: string;
  absender: string;
  empfaenger: string;
};

export type NavItems = NavItem[]

export type Identifiable = { id: string };
export type WithTimestamp = { timestamp: string };
export type WithBearbeiter = { bearbeiter: Bearbeiter };

export type IdentifiableWithTimestamp = Identifiable & WithTimestamp;
export type IdentifiableWithTimestampAndBearbeiter = Identifiable & WithTimestamp & WithBearbeiter;
export type IdentifiableLabel = Identifiable & { name: string };