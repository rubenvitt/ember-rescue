-- AlterTable
ALTER TABLE "einsatzMeta" RENAME CONSTRAINT "EinsatzMeta_pkey" TO "einsatzMeta_pkey";

-- RenameIndex
ALTER INDEX "EinsatzMeta_einsatzId_idx" RENAME TO "einsatzMeta_einsatzId_idx";

-- RenameIndex
ALTER INDEX "EinsatzMeta_einsatzId_key" RENAME TO "einsatzMeta_einsatzId_key";
