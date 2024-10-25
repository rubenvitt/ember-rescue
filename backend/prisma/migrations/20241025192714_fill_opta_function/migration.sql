-- Migration Script für optaFunktion

BEGIN;

-- 1. Kategorien für optaCategory hinzufügen, falls sie noch nicht existieren
INSERT INTO "optaCategory" ("id", "label", "group")
VALUES (generate_cuid(), 'Ortsfeste Funkstellen', 'Sonder'),
       (generate_cuid(), 'Funktionskennungen', 'Funktionen'),
       (generate_cuid(), 'Einsatzleitfahrzeuge', 'Fahrzeuge'),
       (generate_cuid(), 'Mannschaftstransport', 'Fahrzeuge'),
       (generate_cuid(), 'Logistikfahrzeuge', 'Fahrzeuge'),
       (generate_cuid(), 'Betreuungsfahrzeuge', 'Fahrzeuge'),
       (generate_cuid(), 'Notfallrettung', 'Fahrzeuge'),
       (generate_cuid(), 'Vorübergehende Einrichtungen', 'Fahrzeuge'),
       (generate_cuid(), 'Krankentransport', 'Fahrzeuge'),
       (generate_cuid(), 'Sanitätsdienst', 'Fahrzeuge'),
       (generate_cuid(), 'Spezialtransport', 'Fahrzeuge'),
       (generate_cuid(), 'Sonstige Transportmittel', 'Fahrzeuge')
ON CONFLICT DO NOTHING;

-- 3. Datensätze in optaFunktion mit dynamisch zugewiesenen categoryIds einfügen
INSERT
INTO "optaFunktion" ("id", "label", "optaCode", "categoryId")
VALUES (generate_cuid(), 'Rettungswache, ortsfeste Funkstelle', 0, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Ortsfeste Funkstellen')),
       (generate_cuid(), 'Leiter der Organisation', 1, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Stellvertretender Leiter', 2, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Kontingentführung/Führung von Einheiten ab Verbandsgröße', 3, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Sonstige Leitungsfunktionen', 4, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Sonstige Leitungsfunktionen', 5, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Sonstige Leitungsfunktionen', 6, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Leitender Notarzt', 7, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Organisatorischer Leiter Rettungsdienst', 8, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Fachberater, sonstige Funktionen', 9, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Funktionskennungen')),
       (generate_cuid(), 'Kommandowagen', 10, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Einsatzleitfahrzeuge')),
       (generate_cuid(), 'Einsatzleitwagen 1', 11, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Einsatzleitfahrzeuge')),
       (generate_cuid(), 'Einsatzleitwagen 2', 12, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Einsatzleitfahrzeuge')),
       (generate_cuid(), 'Teilstationäre Führungsmittel', 13, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Einsatzleitfahrzeuge')),
       (generate_cuid(), 'Sonstige Fernmeldefahrzeuge', 14, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Einsatzleitfahrzeuge')),
       (generate_cuid(), 'Kombinationskraftwagen UAV', 15, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Einsatzleitfahrzeuge')),
       (generate_cuid(), 'MTW (Betreuung, PSNV, Verpflegung)', 16, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Mannschaftstransport')),
       (generate_cuid(), 'Mannschaftstransportwagen', 17, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Mannschaftstransport')),
       (generate_cuid(), 'Kraftomnibus', 18, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Mannschaftstransport')),
       (generate_cuid(), 'Sonstige ELW, MTW, PKW', 19, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Mannschaftstransport')),
       (generate_cuid(), 'Gerätewagen Logistikgruppe', 59, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Kombinationskraftwagen Logistik', 60, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Schlauchwagen 500/1000 oder GW Logistik Schlauch (mind. 1000m B-Schlauch)', 61, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Schlauchwagen 2000/KatS oder GW Logistik Schlauch (mind. 2000m B-Schlauch)', 62, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Kleinlastkraftwagen < 3,5t zGM, Gerätewagen Logistik ≤ 7,49t zGM', 63, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'GW Nachschub, GW Logistik 1, GW Logistik klein (KatS), LKW ≤ 12t mit Ladebordwand', 64, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Wechselladerfahrzeug 5500 (18t)', 65, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Wechselladerfahrzeug 6500 (26t)', 66, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Wechselladerfahrzeug Kran', 67, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'GW Logistik 2, GW Logistik groß (KatS), LKW > 12t mit Ladebordwand', 68, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'LKW-Kipper, Sattelzugmaschine, sonstige Versorgungs- und Logistikfahrzeuge', 69, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Logistikfahrzeuge')),
       (generate_cuid(), 'Gerätewagen Betreuung', 74, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Betreuungsfahrzeuge')),
       (generate_cuid(), 'Gerätewagen Verpflegung/Küche', 76, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Betreuungsfahrzeuge')),
       (generate_cuid(), 'Arztbesetzte Luftfahrzeuge', 80, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Notarztwagen', 81, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Notarzteinsatzfahrzeug', 82, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Rettungswagen - RD', 83, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Rettungswagen - RD temporär', 84, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Rettungswagen - GSE/erweiterter RD/KatS', 85, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Baby-Notarztwagen', 86, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Intensivtransportwagen', 87, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Großraumrettungswagen', 88, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Sonstige Rettungsmittel', 89, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Notfallrettung')),
       (generate_cuid(), 'Behandlungsplatz, Betreuungsstelle, Unfallhilfsstelle', 90, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Vorübergehende Einrichtungen')),
       (generate_cuid(), 'Krankentransportwagen', 92, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Krankentransport')),
       (generate_cuid(), 'Notfallkrankenwagen - RD', 93, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Krankentransport')),
       (generate_cuid(), 'KTW 4-Tragen oder 2-Tragen', 94, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Krankentransport')),
       (generate_cuid(), 'GW Behandlungsplatz/MANV', 95, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Sanitätsdienst')),
       (generate_cuid(), 'GW Sanität, GW Behandlung', 96, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Sanitätsdienst')),
       (generate_cuid(), 'Infektions-KTW/RTW', 97, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Spezialtransport')),
       (generate_cuid(), 'KTW/RTW geländegängig', 98, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Spezialtransport')),
       (generate_cuid(), 'MTW-multifunktional, Behindertenfahrzeuge', 99, (SELECT "id" FROM "optaCategory" WHERE "label" = 'Sonstige Transportmittel'))
ON CONFLICT ("optaCode") DO NOTHING;

COMMIT;
