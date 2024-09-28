-- CreateEnum
CREATE TYPE "MaintenanceItemPriority" AS ENUM ('immediate', 'high', 'low');

-- AlterTable
ALTER TABLE "MaintenanceItem" ADD COLUMN     "priority" "MaintenanceItemPriority" NOT NULL DEFAULT 'high',
ADD COLUMN     "propertyId" INTEGER;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "MaintenanceItem" ADD CONSTRAINT "MaintenanceItem_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
