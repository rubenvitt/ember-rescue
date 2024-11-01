import {
  EinheitId,
  FachaufgabeId,
  FunktionId,
  GrundzeichenId,
  OrganisationId,
  SymbolId,
  VerwaltungsstufeId,
} from 'taktische-zeichen-core';

function convertScreamingToKebabCase(grundzeichen: string | undefined) {
  return grundzeichen?.toLowerCase().replace(/_/g, '-');
}

export function convertGrundzeichen(grundzeichen: string | undefined): GrundzeichenId | undefined {
  return convertScreamingToKebabCase(grundzeichen) as GrundzeichenId | undefined;
}

export function convertOrganisation(organisation: string | undefined): OrganisationId | undefined {
  return convertScreamingToKebabCase(organisation) as OrganisationId | undefined;
}

export function convertFachaufgabe(fachaufgabe: string | undefined): FachaufgabeId | undefined {
  return convertScreamingToKebabCase(fachaufgabe) as FachaufgabeId | undefined;
}

export function convertEinheit(einheit: string | undefined): EinheitId | undefined {
  return convertScreamingToKebabCase(einheit) as EinheitId | undefined;
}

export function convertFunktion(funktion: string | undefined): FunktionId | undefined {
  return convertScreamingToKebabCase(funktion) as FunktionId | undefined;
}

export function convertVerwaltungsstufe(verwaltungsstufe: string | undefined): VerwaltungsstufeId | undefined {
  return convertScreamingToKebabCase(verwaltungsstufe) as VerwaltungsstufeId | undefined;
}

export function convertSymbol(status: string | undefined): SymbolId | undefined {
  return convertScreamingToKebabCase(status) as SymbolId | undefined;
}
