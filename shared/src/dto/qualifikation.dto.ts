import { Identifiable } from './common';

export type QualifikationDto = Identifiable & {
  label: string;
  abkuerzung: string;
};
