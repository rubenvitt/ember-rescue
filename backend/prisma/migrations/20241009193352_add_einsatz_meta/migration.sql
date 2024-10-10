-- CreateTable
CREATE TABLE "EinsatzMeta"
(
    "id"        TEXT NOT NULL,
    "ort"       TEXT,
    "einsatzId" TEXT NOT NULL,

    CONSTRAINT "EinsatzMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EinsatzMeta_einsatzId_key" ON "EinsatzMeta" ("einsatzId");

-- CreateIndex
CREATE INDEX "EinsatzMeta_einsatzId_idx" ON "EinsatzMeta" ("einsatzId");

INSERT INTO "EinsatzMeta" ("id", "einsatzId", "ort")
SELECT generate_cuid(), "id", ''
FROM "einsaetze";

-- AddForeignKey
ALTER TABLE "einsaetze"
    ADD CONSTRAINT "einsaetze_id_fkey" FOREIGN KEY ("id") REFERENCES "EinsatzMeta" ("einsatzId") ON DELETE CASCADE ON UPDATE NO ACTION;
