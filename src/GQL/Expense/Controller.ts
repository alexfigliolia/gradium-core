import { Prisma } from "DB/Client";
import { PersonController } from "GQL/Person/Controller";
import { Access } from "./Access";
import type { ICreateExpense, IUpdateExpense } from "./Types";

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

  public static update = async ({
    id,
    propertyId: _,
    ...data
  }: IUpdateExpense) => {
    const expense = await Prisma.transact(client => {
      return client.expense.update({
        where: { id },
        data,
        select: this.DEFAULT_SELECTION,
      });
    });
    return {
      ...expense,
      createdBy: PersonController.toPersonType(expense.createdBy),
    };
  };
}
