/*
  Warnings:

  - You are about to drop the column `deleted` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `LivingSpace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Amenity" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "LivingSpace" DROP COLUMN "deleted";
