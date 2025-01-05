import { Prisma } from "DB/Client";
import type {
  ICreateGradiumImage,
  IDeleteGradiumImage,
  IGradiumImage,
} from "./Types";
import { IGradiumImageType } from "./Types";

export class ImageController {
  private readonly DEFAULT_SELECTION = {
    id: true,
    url: true,
  };
  private readonly createOperationMap = {
    [IGradiumImageType.propertyImage]: this.createOperation("propertyImage"),
    [IGradiumImageType.livingSpaceImage]:
      this.createOperation("livingSpaceImage"),
    [IGradiumImageType.livingSpaceFloorPlan]: this.createOperation(
      "livingSpaceFloorPlan",
    ),
    [IGradiumImageType.amenityImage]: this.createOperation("amenityImage"),
    [IGradiumImageType.amenityFloorPlan]:
      this.createOperation("amenityFloorPlan"),
    [IGradiumImageType.taskImage]: this.createOperation("taskImage"),
    [IGradiumImageType.expenseAttachment]:
      this.createOperation("expenseAttachment"),
  };
  private readonly deleteOperationMap = {
    [IGradiumImageType.propertyImage]: this.deleteOperation("propertyImage"),
    [IGradiumImageType.livingSpaceImage]:
      this.deleteOperation("livingSpaceImage"),
    [IGradiumImageType.livingSpaceFloorPlan]: this.deleteOperation(
      "livingSpaceFloorPlan",
    ),
    [IGradiumImageType.amenityImage]: this.deleteOperation("amenityImage"),
    [IGradiumImageType.amenityFloorPlan]:
      this.deleteOperation("amenityFloorPlan"),
    [IGradiumImageType.taskImage]: this.deleteOperation("taskImage"),
    [IGradiumImageType.expenseAttachment]:
      this.deleteOperation("expenseAttachment"),
  };

  public create = (data: Omit<ICreateGradiumImage, "organizationId">) => {
    return this.createOperationMap[data.type](data.entityId, data.url);
  };

  public delete = (data: Omit<IDeleteGradiumImage, "organizationId">) => {
    return this.deleteOperationMap[data.type](data.id);
  };

  private createOperation<T extends TableName>(table: T) {
    return (id: number, url: string): Promise<IGradiumImage> => {
      return Prisma.transact(client => {
        // @ts-ignore
        return client[table].create({
          data: {
            url,
            [TableMap[table]]: id,
          },
          select: this.DEFAULT_SELECTION,
        });
      });
    };
  }

  private deleteOperation<T extends TableName>(table: T) {
    return (id: number): Promise<IGradiumImage> => {
      return Prisma.transact(client => {
        // @ts-ignore
        return client[table].delete({
          where: {
            id,
          },
          select: this.DEFAULT_SELECTION,
        });
      });
    };
  }
}

enum TableMap {
  "propertyImage" = "propertyId",
  "livingSpaceImage" = "livingSpaceId",
  "livingSpaceFloorPlan" = "livingSpaceId",
  "amenityImage" = "amenityId",
  "amenityFloorPlan" = "amenityId",
  "taskImage" = "taskId",
  "expenseAttachment" = "expenseId",
}

type TableName =
  | "propertyImage"
  | "livingSpaceImage"
  | "livingSpaceFloorPlan"
  | "amenityImage"
  | "amenityFloorPlan"
  | "taskImage"
  | "expenseAttachment";
