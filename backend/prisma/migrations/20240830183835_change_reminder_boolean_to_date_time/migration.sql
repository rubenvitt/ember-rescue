/*
  Warnings:

  - The `notified` column on the `reminders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "read" TIMESTAMP(3),
DROP COLUMN "notified",
ADD COLUMN     "notified" TIMESTAMP(3);
