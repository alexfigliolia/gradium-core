import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { Permission } from "Tools/Permission";
import { Validators } from "Tools/Validators";
import type { ICreateUser, IdentifyEmail, IUpdateEmail } from "./Types";

export class UserController {
  public static findByEmail(email: string) {
    return Prisma.transact(async client => {
      const link = await client.linkedEmail.findUnique({
        where: { email },
        select: { user: true },
      });
      return link?.user;
    });
  }

  public static findByID(id: number) {
    return Prisma.transact(client => {
      return client.user.findUnique({ where: { id } });
    });
  }

  public static createUser({ name, password }: ICreateUser) {
    return Prisma.transact(client => {
      return client.user.create({
        data: {
          name,
          password,
        },
      });
    });
  }

  public static async linkEmail({ userId, email }: IdentifyEmail) {
    Validators.validateEmail(email);
    return Prisma.transact(client => {
      return client.linkedEmail.create({
        data: {
          userId,
          email,
        },
      });
    });
  }

  public static async deleteEmail({ userId, email }: IdentifyEmail) {
    Validators.validateEmail(email);
    return Prisma.transact(client => {
      return client.linkedEmail.delete({
        where: {
          userId,
          email,
        },
      });
    });
  }

  public static async updateEmail({ userId, previous, next }: IUpdateEmail) {
    Validators.validateEmail(next);
    if (previous === next) {
      return;
    }
    return Prisma.transact(client => {
      return client.linkedEmail.update({
        where: {
          userId,
          email: previous,
        },
        data: {
          email: next,
        },
      });
    });
  }

  public static authenticatedUserScope(id: number) {
    return Prisma.transact(client => {
      return client.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          emails: {
            select: {
              email: true,
            },
          },
          affiliations: {
            select: {
              organization: {
                select: {
                  id: true,
                  name: true,
                },
              },
              roles: {
                select: {
                  role: true,
                },
              },
            },
            orderBy: {
              organization: {
                createdAt: "desc",
              },
            },
          },
        },
      });
    });
  }

  public static createUserModifier<A extends { userId: number }>(
    callback: (args: A) => any,
  ) {
    return async (request: Request, args: A) => {
      if (!Permission.matchesKnownUser(request.session, args.userId)) {
        throw new GraphQLError(
          "An email address may only be modified by the person that owns it",
        );
      }
      await callback(args);
      return Prisma.transact(client => {
        return client.user.findUnique({
          where: {
            id: args.userId,
          },
          select: {
            name: true,
            emails: {
              select: {
                email: true,
              },
            },
          },
        });
      });
    };
  }
}
