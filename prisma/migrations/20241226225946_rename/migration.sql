/*
  Warnings:

  - You are about to drop the column `assignStaffId` on the `ManagementTask` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ManagementTask" DROP CONSTRAINT "ManagementTask_assignStaffId_fkey";

-- AlterTable
ALTER TABLE "ManagementTask" DROP COLUMN "assignStaffId",
ADD COLUMN     "assignedToId" INTEGER;

-- AddForeignKey
ALTER TABLE "ManagementTask" ADD CONSTRAINT "ManagementTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
