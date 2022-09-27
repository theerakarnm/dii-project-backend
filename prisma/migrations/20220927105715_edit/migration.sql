/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Diaries` table. All the data in the column will be lost.
  - You are about to drop the column `usersUsername` on the `Diaries` table. All the data in the column will be lost.
  - Added the required column `assignTo` to the `Diaries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Diaries" DROP CONSTRAINT "Diaries_usersUsername_fkey";

-- AlterTable
ALTER TABLE "Diaries" DROP COLUMN "dateTime",
DROP COLUMN "usersUsername",
ADD COLUMN     "assignBy" TEXT,
ADD COLUMN     "assignTo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Diaries" ADD CONSTRAINT "Diaries_assignBy_fkey" FOREIGN KEY ("assignBy") REFERENCES "Users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
