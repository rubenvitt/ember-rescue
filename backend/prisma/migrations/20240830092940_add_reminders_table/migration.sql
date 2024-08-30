/*
  Warnings:

  - You are about to drop the column `reminder` on the `notizen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notizen"
    DROP COLUMN "reminder",
    ADD COLUMN "reminderId" TEXT;

-- CreateTable
CREATE TABLE "reminders"
(
    "id"                TEXT         NOT NULL,
    "noteId"            TEXT         NOT NULL,
    "reminderTimestamp" TIMESTAMP(3) NOT NULL,
    "notified"          BOOLEAN      NOT NULL DEFAULT false,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reminders"
    ADD CONSTRAINT "reminders_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notizen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
