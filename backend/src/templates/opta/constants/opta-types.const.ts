export enum OptaType {
  DISTRICT = 'DISTRICT',
  BOS_CODE = 'BOS_CODE', // FW, DRK, etc. als BOS-Code
  LOCAL_CODE = 'LOCAL_CODE', // Örtliche Kennungen
  FUNCTION_CODE = 'FUNCTION_CODE', // Fahrzeug/Funktionskennungen
  //SHORT_NAME = 'SHORT_NAME', // Kurzbezeichnungen TODO z.B. Gruppenführer Sanität oder so
}

// FIXME[ember-rescue-68](rubeen, 17.11.24): this may be unused
export enum BosGroup {
  Feuerwehren = 'Feuerwehren',
  Hilfsorganisationen = 'Hilfsorganisationen',
  Katastrophenschutz = 'Katastrophenschutz',
  Polizei = 'Polizei',
  SonstigeBOS = 'Sonstige BOS',
}

export enum FunctionGroup {
  OrtsfesteFunkstellen = 'Ortsfeste Funkstellen',
  Funktionskennungen = 'Funktionskennungen',
  Einsatzleitfahrzeuge = 'Einsatzleitfahrzeuge',
  Mannschaftstransport = 'Mannschaftstransport',
  Logistikfahrzeuge = 'Logistikfahrzeuge',
  Betreuungsfahrzeuge = 'Betreuungsfahrzeuge',
  Notfallrettung = 'Notfallrettung',
  VoruebergehendeEinrichtungen = 'Vorübergehende Einrichtungen',
  Krankentransport = 'Krankentransport',
  Sanitaetsdienst = 'Sanitätsdienst',
  Spezialtransport = 'Spezialtransport',
  SonstigeTransportmittel = 'Sonstige Transportmittel',
}

export enum LocalGroup {
  MinisteriumFuerInneresUndSport = 'Ministerium für Inneres und Sport',
  NiedersaechsischesLandesamtFuerBrandUndKatastrophenschutz = 'Niedersächsisches Landesamt für Brand- und Katastrophenschutz',
  Sonstige = 'Sonstige',
  GemeindeFF = 'Gemeinde / FF',
  HilfsorganisationenAufLandesebene = 'Hilfsorganisationen auf Landesebene',
  BeauftragteFuerRDOhneHilfsorganisation = 'Beauftragte für RD ohne Hilfsorganisation',
  LandeseinheitenImKatastrophenschutz = 'Landeseinheiten im Katastrophenschutz',
  Intensivtransport = 'Intensivtransport',
  Waldbrandbeauftragte = 'Waldbrandbeauftragte',
  Werkfeuerwehr = 'Werkfeuerwehr',
  FuehrungskraefteRettungsdienst = 'Führungskräfte Rettungsdienst',
  FuehrungskraefteFeuerwehr = 'Führungskräfte Feuerwehr',
}
