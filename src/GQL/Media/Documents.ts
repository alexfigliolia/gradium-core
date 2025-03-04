import { Prisma } from "DB/Client";
import type {
  ICreateGradiumDocument,
  IDeleteGradiumDocument,
  IGradiumDocument,
} from "./Types";
import { IGradiumDocumentType } from "./Types";

export class DocumentController {
  private readonly DEFAULT_SELECTION = {
    id: true,
    url: true,
    thumbnail: true,
  } as const;

  private readonly createOperationMap = {
    [IGradiumDocumentType.leaseDocument]: this.createOperation("leaseDocument"),
  };
  private readonly deleteOperationMap = {
    [IGradiumDocumentType.leaseDocument]: this.deleteOperation("leaseDocument"),
  };

  public create = (data: Omit<ICreateGradiumDocument, "organizationId">) => {
    return this.createOperationMap[data.type](data.entityId, data);
  };

  public delete = (data: Omit<IDeleteGradiumDocument, "organizationId">) => {
    return this.deleteOperationMap[data.type](data.id);
  };

  private createOperation<T extends TableName>(table: T) {
    return (id: number, data: Omit<IGradiumDocument, "id">) => {
      return Prisma.transact(client => {
        return client[table].create({
          // @ts-ignore
          data: {
            ...data,
            [TableMap[table]]: id,
          },
          select: this.DEFAULT_SELECTION,
        });
      });
    };
  }

  private deleteOperation<T extends TableName>(table: T) {
    return (id: number) => {
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
  "leaseDocument" = "leaseId",
}

type TableName = "leaseDocument";
