BEGIN;

-- 1. Kategorien für optaCategory hinzufügen, falls sie noch nicht existieren
-- Ohne RETURNING
INSERT INTO "optaCategory" ("id", "label", "group")
VALUES (generate_cuid(), 'Städte und Gemeinden', 'Organisationen'),
       (generate_cuid(), 'Hilfsorganisationen', 'Organisationen'),
       (generate_cuid(), 'Sonstige Organisationen', 'Organisationen'),
       (generate_cuid(), 'Kommunale Behörden', 'Organisationen'),
       (generate_cuid(), 'Spezialfunktionen', 'Organisationen'),
       (generate_cuid(), 'Reservierte Codes', 'Organisationen');

-- 2. IDs der bestehenden Kategorien oder neu hinzugefügten Kategorien abfragen
WITH categories AS (SELECT "id", "label"
                    FROM "optaCategory"
                    WHERE "label" IN (
                                      'Städte und Gemeinden',
                                      'Hilfsorganisationen',
                                      'Sonstige Organisationen',
                                      'Kommunale Behörden',
                                      'Spezialfunktionen',
                                      'Reservierte Codes'
                        ))

-- 3. Datensätze in optaOrt mit dynamisch zugewiesenen categoryIds einfügen
INSERT
INTO "optaOrt" ("id", "label", "optaCode", "categoryId")
VALUES (generate_cuid(), 'Kreisfreie Städte, Landeshauptstadt Hannover und die Städte Cuxhaven, Hameln, Hildesheim und Göttingen', 1,
        (SELECT "id" FROM categories WHERE "label" = 'Städte und Gemeinden')),
       (generate_cuid(), 'Gemeindekennziffern, Vergabe durch Landkreis. Städte mit Ziffern 01-09 dürfen diese für Freiwillige Feuerwehren nutzen', 10,
        (SELECT "id" FROM categories WHERE "label" = 'Städte und Gemeinden')),
       (generate_cuid(), 'Deutsches Rotes Kreuz', 40, (SELECT "id" FROM categories WHERE "label" = 'Hilfsorganisationen')),
       (generate_cuid(), 'Johanniter-Unfall-Hilfe', 49, (SELECT "id" FROM categories WHERE "label" = 'Hilfsorganisationen')),
       (generate_cuid(), 'Malteser Hilfsdienst', 57, (SELECT "id" FROM categories WHERE "label" = 'Hilfsorganisationen')),
       (generate_cuid(), 'Arbeiter-Samariter-Bund', 64, (SELECT "id" FROM categories WHERE "label" = 'Hilfsorganisationen')),
       (generate_cuid(), 'Deutsche Lebens-Rettungs-Gesellschaft', 71, (SELECT "id" FROM categories WHERE "label" = 'Hilfsorganisationen')),
       (generate_cuid(), 'Beauftragte für Rettungsdienst oder Mitwirkende im Katastrophenschutz (nicht o.g. Hilfsorganisationen)', 78,
        (SELECT "id" FROM categories WHERE "label" = 'Sonstige Organisationen')),
       (generate_cuid(), 'Funkgeräte im Eigentum der Kommunen', 80, (SELECT "id" FROM categories WHERE "label" = 'Kommunale Behörden')),
       (generate_cuid(), 'Intensivtransport', 91, (SELECT "id" FROM categories WHERE "label" = 'Spezialfunktionen')),
       (generate_cuid(), 'Waldbrandbeauftragte', 92, (SELECT "id" FROM categories WHERE "label" = 'Spezialfunktionen')),
       (generate_cuid(), 'Werkfeuerwehren', 93, (SELECT "id" FROM categories WHERE "label" = 'Spezialfunktionen')),
       (generate_cuid(), 'Werkfeuerwehren', 94, (SELECT "id" FROM categories WHERE "label" = 'Spezialfunktionen')),
       (generate_cuid(), 'Gesperrt', 95, (SELECT "id" FROM categories WHERE "label" = 'Reservierte Codes')),
       (generate_cuid(), 'Führungskräfte Rettungsdienst', 97, (SELECT "id" FROM categories WHERE "label" = 'Spezialfunktionen')),
       (generate_cuid(), 'Gesperrt', 98, (SELECT "id" FROM categories WHERE "label" = 'Reservierte Codes')),
       (generate_cuid(), 'Führungskräfte der Kreisfeuerwehr und der kreisfreien Städte', 99,
        (SELECT "id" FROM categories WHERE "label" = 'Spezialfunktionen'))
ON CONFLICT ("optaCode") DO NOTHING;

COMMIT;