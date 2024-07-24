/*
  Warnings:

  - You are about to drop the column `gmailId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "gmailId",
ADD COLUMN     "googleId" TEXT;
