import { ToPathOption } from '@tanstack/react-router';
import { EinsatztagebuchEintragType } from '@common-dtos/einsatztagebuch.dto';
import React from 'react';
import { XOR } from '@headlessui/react/dist/types.js';

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

export type ﬂNavItems = NavItem[]

export type DropdownItem = {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} & XOR<{
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