/*
  Warnings:

  - You are about to drop the column `livingSpaceId` on the `AmenityReservation` table. All the data in the column will be lost.
  - Added the required column `personOrganizationId` to the `AmenityReservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personUserId` to the `AmenityReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AmenityReservation" DROP CONSTRAINT "AmenityReservation_livingSpaceId_fkey";

-- AlterTable
ALTER TABLE "Amenity" ALTER COLUMN "open" SET DEFAULT '09:00:00',
ALTER COLUMN "close" SET DEFAULT '21:00:00';

-- AlterTable
ALTER TABLE "AmenityReservation" DROP COLUMN "livingSpaceId",
ADD COLUMN     "personOrganizationId" INTEGER NOT NULL,
ADD COLUMN     "personUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AmenityReservation" ADD CONSTRAINT "AmenityReservation_personOrganizationId_personUserId_fkey" FOREIGN KEY ("personOrganizationId", "personUserId") REFERENCES "Person"("organizationId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
