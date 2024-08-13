-- AlterTable
ALTER TABLE "notizen"
    ADD COLUMN "deletedAt" TIMESTAMP(3),
    ADD COLUMN "doneAt"    TIMESTAMP(3);
