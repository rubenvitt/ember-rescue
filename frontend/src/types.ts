import { ToPathOption } from '@tanstack/react-router';

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

export type NavItems = NavItem[]

export type IdentifiableLabel = { id: string, label: string };