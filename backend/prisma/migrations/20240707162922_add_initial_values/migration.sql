-- Funktion zur Generierung von CUID-ähnlichen IDs
CREATE
    OR REPLACE FUNCTION generate_cuid() RETURNS TEXT AS
$$
DECLARE
    id TEXT;
BEGIN
    id
        := LOWER(
            'c' ||
            TO_CHAR(CURRENT_TIMESTAMP, 'YYMMDDHH24MISSUS') ||
            LPAD(TO_HEX(FLOOR(RANDOM() * 1099511627776)::BIGINT), 10, '0')
           );
    RETURN id;
END;
$$
    LANGUAGE plpgsql;

-- Einfügen der offiziellen Status-Codes mit angepassten Beschreibungen
INSERT INTO status ("id", "code", "bezeichnung", "beschreibung", "createdAt", "updatedAt")
VALUES (generate_cuid(), '1', 'Einsatzbereit auf Funk',
        'Einheit ist verfügbar und kann über Funk für neue Einsätze angefordert werden',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '2', 'Einsatzbereit auf Wache / Standort',
        'Einheit befindet sich einsatzbereit auf der Wache oder am zugewiesenen Standort', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (generate_cuid(), '3', 'Einsatzübernahme (ausgerückt)',
        'Einheit hat einen Einsatz übernommen und befindet sich auf dem Weg zum Einsatzort', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (generate_cuid(), '4', 'Einsatzort (vor Ort)',
        'Einheit ist am Einsatzort eingetroffen und führt den Einsatz durch',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '5', 'Sprechwunsch',
        'Einheit wünscht Kontakt zur Leitstelle für nicht dringende Kommunikation',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '6', 'Nicht einsatzbereit / außer Dienst',
        'Einheit ist vorübergehend nicht verfügbar oder außer Dienst gestellt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '7', 'Einsatzgebunden',
        'Rettungsdiensteinheit ist in einem laufenden Einsatz gebunden, z.B. während der Patientenversorgung',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '8', 'Bedingt verfügbar / am Zielort',
        'Rettungsdiensteinheit ist am Zielort (z.B. Krankenhaus) und könnte bedingt für neue Einsätze verfügbar sein',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '9', 'Quittung / Datenabfrage (nur besondere Fahrzeuge)',
        'Spezialeinheit führt Datenabfrage durch oder quittiert einen Auftrag, gilt nur für bestimmte Fahrzeuge',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), '0', 'Priorisierter Sprechwunsch',
        'Einheit benötigt dringend Kontakt zur Leitstelle, hat Priorität vor normalen Sprechwünschen',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- INSERT-Statements für Qualifikationen
INSERT INTO qualifikationen (id, bezeichnung, abkuerzung, "createdAt", "updatedAt")
VALUES (generate_cuid(), 'Rettungssanitäter', 'RS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Rettungsassistent', 'RA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Notfallsanitäter', 'NFS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Notarzt', 'NA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Sanitätshelfer', 'SH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Sanitäter im Katastrophenschutz', 'SanK', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Sanitäter', 'San', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (generate_cuid(), 'Ersthelfer', 'EH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Einfügen der Alarmstichworte
INSERT INTO alarmstichworte (id, "updatedAt", bezeichnung, beschreibung)
VALUES (generate_cuid(), NOW(), 'MANV7', 'Massenanfall von 7 Verletzten/Erkrankten'),
       (generate_cuid(), NOW(), 'MANV15', 'Massenanfall von 15 Verletzten/Erkrankten'),
       (generate_cuid(), NOW(), 'MANV25', 'Massenanfall von 25 Verletzten/Erkrankten'),
       (generate_cuid(), NOW(), 'Drohne', 'Einsatz mit der Drohne'),
       (generate_cuid(), NOW(), 'RTW', 'Einsatz für einen RTW zur Gebietsabdeckung (erweiterter RD)'),
       (generate_cuid(), NOW(), 'RHS', 'Rettungshundestaffeleinsatz (Landkreis)'),
       (generate_cuid(), NOW(), 'WY', 'Wasserrettungslage mit Menschenleben in Gefahr'),
       (generate_cuid(), NOW(), 'Betreuungseinsatz', 'Einsatz zur Betreuung von Personen'),
       (generate_cuid(), NOW(), 'LEBEL', 'Lebensbedrohliche Einsatzlage'),
       (generate_cuid(), NOW(), 'MANV S', 'MANV sofort (Überregional)'),
       (generate_cuid(), NOW(), 'MANV T', 'MANV Transport (Überregional)'),
       (generate_cuid(), NOW(), 'MANV PA', 'MANV Patientenablage (Überregional)'),
       (generate_cuid(), NOW(), 'MANV BHP', 'MANV Behandlungsplatz (Überregional)'),
       (generate_cuid(), NOW(), 'B2', 'Brand 2 - Mittlerer Brand'),
       (generate_cuid(), NOW(), 'B2Y', 'Brand 2 - Mittlerer Brand mit Menschenleben in Gefahr'),
       (generate_cuid(), NOW(), 'B3', 'Brand 3 - Großbrand'),
       (generate_cuid(), NOW(), 'B3Y', 'Brand 3 - Großbrand mit Menschenleben in Gefahr'),
       (generate_cuid(), NOW(), 'B4', 'Brand 4 - Großbrand, erweiterte Anforderung'),
       (generate_cuid(), NOW(), 'B4Y', 'Brand 4 - Großbrand, erweiterte Anforderung mit Menschenleben in Gefahr'),
       (generate_cuid(), NOW(), 'H3', 'Hilfeleistung 3 - Größere technische Hilfeleistung'),
       (generate_cuid(), NOW(), 'H3Y',
        'Hilfeleistung 3 - Größere technische Hilfeleistung mit Menschenleben in Gefahr'),
       (generate_cuid(), NOW(), 'ABC2', 'ABC-Einsatz 2 - Mittlerer Gefahrstoffeinsatz'),
       (generate_cuid(), NOW(), 'ABC3', 'ABC-Einsatz 3 - Großer Gefahrstoffeinsatz'),
       (generate_cuid(), NOW(), 'ABC4', 'ABC-Einsatz 4 - Großer Gefahrstoffeinsatz, erweiterte Anforderung'),
       (generate_cuid(), NOW(), 'WB3', 'Waldbrand 3 - Großer Waldbrand'),
       (generate_cuid(), NOW(), 'WB4', 'Waldbrand 4 - Großer Waldbrand, erweiterte Anforderung'),
       (generate_cuid(), NOW(), 'PSNV E', 'Psychosoziale Notfallversorgung Einsatzkräfte');
