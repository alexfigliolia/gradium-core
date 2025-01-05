import { Prisma } from "DB/Client";
import { PersonController } from "GQL/Person/Controller";
import { Access } from "./Access";
import type { ICreateExpense } from "./Types";

export class ExpenseController extends Access {
  public static create = async (
    { propertyId: _, ...data }: ICreateExpense,
    userID: number,
  ) => {
    const personId = await PersonController.requirePersonID(
      userID,
      data.organizationId,
    );
    const expense = await Prisma.transact(client => {
      return client.expense.create({
        data: {
          ...data,
          personId,
        },
        select: this.DEFAULT_SELECTION,
      });
    });
    return {
      ...expense,
      createdBy: PersonController.toPersonType(expense.createdBy),
    };
  };
}
