import { ToPathOption } from '@tanstack/react-router';
import { EinsatztagebuchEintragType } from '@common-dtos/einsatztagebuch.dto';
import React from 'react';
import { XOR } from './types/helper.js';

export type Bearbeiter = {
  id: string;
  name: string;
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