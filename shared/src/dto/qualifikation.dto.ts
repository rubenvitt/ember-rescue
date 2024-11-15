import { Identifiable } from "./common";

export type QualifikationDto = Identifiable & {
  bezeichnung: string;
  abkuerzung: string;
};
