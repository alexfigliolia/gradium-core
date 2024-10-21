-- DropForeignKey
ALTER TABLE "AmenityFloorPlan" DROP CONSTRAINT "AmenityFloorPlan_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "AmenityImage" DROP CONSTRAINT "AmenityImage_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "LivingSpaceFloorPlan" DROP CONSTRAINT "LivingSpaceFloorPlan_livingSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "LivingSpaceImage" DROP CONSTRAINT "LivingSpaceImage_livingSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "TaskImage" DROP CONSTRAINT "TaskImage_taskId_fkey";

-- AddForeignKey
ALTER TABLE "TaskImage" ADD CONSTRAINT "TaskImage_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ManagementTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityFloorPlan" ADD CONSTRAINT "AmenityFloorPlan_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityImage" ADD CONSTRAINT "AmenityImage_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingSpaceImage" ADD CONSTRAINT "LivingSpaceImage_livingSpaceId_fkey" FOREIGN KEY ("livingSpaceId") REFERENCES "LivingSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingSpaceFloorPlan" ADD CONSTRAINT "LivingSpaceFloorPlan_livingSpaceId_fkey" FOREIGN KEY ("livingSpaceId") REFERENCES "LivingSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
