/*
  Warnings:

  - A unique constraint covering the columns `[einsatzId,einheitId]` on the table `einheitenOnEinsaetze` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "einheitenOnEinsaetze_einsatzId_einheitId_key" ON "einheitenOnEinsaetze"("einsatzId", "einheitId");
