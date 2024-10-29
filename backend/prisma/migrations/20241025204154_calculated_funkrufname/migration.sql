CREATE OR REPLACE FUNCTION generate_funkrufname(optaOrtId INTEGER, optaFunktionId INTEGER, optaOrdnung INTEGER, label TEXT)
    RETURNS TEXT
    IMMUTABLE
    LANGUAGE sql AS
$$
SELECT CASE
           WHEN optaOrtId IS NOT NULL AND optaFunktionId IS NOT NULL THEN
               CASE
                   WHEN optaOrdnung IS NOT NULL THEN
                       CONCAT(optaOrtId::TEXT, '-', optaFunktionId::TEXT, '-', optaOrdnung::TEXT,
                              CASE WHEN label IS NOT NULL AND label <> '' THEN CONCAT(' (', label, ')') ELSE '' END)
                   ELSE
                       CONCAT(optaOrtId::TEXT, '-', optaFunktionId::TEXT,
                              CASE WHEN label IS NOT NULL AND label <> '' THEN CONCAT(' (', label, ')') ELSE '' END)
                   END
           ELSE
               COALESCE(label, '')
           END;
$$;



ALTER TABLE fahrzeuge
    ADD COLUMN funkrufname TEXT NOT NULL GENERATED ALWAYS AS (
        generate_funkrufname("optaOrtId", "optaFunktionId", "optaOrdnung", label)
        ) STORED;