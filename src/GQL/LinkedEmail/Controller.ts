import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import type { IUpdateStringValue } from "GQL/User/Types";
import type { IUserModifierTransaction } from "Tools/Permission";
import { Permission } from "Tools/Permission";
import { Validators } from "Tools/Validators";
import type { IdentifyEmail } from "./Types";

export class LinkedEmailController {
  public static async linkEmail({ userId, email }: IdentifyEmail) {
    Validators.validateEmail(email);
    return Prisma.transact(async client => {
      if (await this.findUnique(userId, email)) {
        throw new GraphQLError(
          "This email address is already registered to your account",
        );
      }
      return client.linkedEmail.create({
        data: {
          userId,
          email,
        },
        select: {
          id: true,
        },
      });
    });
  }

  public static async deleteEmail({ userId, email }: IdentifyEmail) {
    Validators.validateEmail(email);
    return Prisma.transact(async client => {
      try {
        const { id } = await client.linkedEmail.delete({
          where: {
            userId,
            email,
          },
          select: {
            id: true,
          },
        });
        return id;
      } catch (err) {
        throw new GraphQLError("This email address no longer exists");
      }
    });
  }

  public static async updateEmail({
    next,
    userId,
    previous,
  }: IUpdateStringValue) {
    Validators.validateEmail(next);
    if (previous === next) {
      return;
    }
    return Prisma.transact(async client => {
      try {
        const { id } = await client.linkedEmail.update({
          where: {
            userId,
            email: previous,
          },
          data: {
            email: next,
          },
          select: {
            id: true,
          },
        });
        return id;
      } catch (err) {
        throw new GraphQLError("This email address no longer exists");
      }
    });
  }

  public static generateUserFlow<A extends { userId: number }>(
    config: IUserModifierTransaction<A>,
  ) {
    const permissedOperation = Permission.createUserModifier(config);
    return async (...args: Parameters<typeof permissedOperation>) => {
      await permissedOperation(...args);
      return this.userWithEmailList(args[1].userId);
    };
  }

  public static userWithEmailList(id: number) {
    return Prisma.transact(client => {
      return client.user.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          emails: {
            select: {
              email: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    });
  }

  private static findUnique(userId: number, email: string) {
    return Prisma.transact(async client => {
      return client.linkedEmail.findUnique({
        where: {
          userId,
          email,
        },
        select: {
          id: true,
        },
      });
    });
  }
}
