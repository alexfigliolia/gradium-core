import { compare, hash } from "bcrypt";
import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { Permission } from "Tools/Permission";
import { Validators } from "Tools/Validators";
import type { ICreateUser, IdentifyEmail, IUpdateStringValue } from "./Types";

export class UserController {
  public static readonly SALTS = 10;

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
    return Prisma.transact(async client => {
      const exists = await client.linkedEmail.findUnique({
        where: {
          userId,
          email,
        },
        select: {
          id: true,
        },
      });
      if (exists) {
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
    return Prisma.transact(client => {
      return client.linkedEmail.delete({
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

  public static async updateEmail({
    userId,
    previous,
    next,
  }: IUpdateStringValue) {
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
        select: {
          id: true,
        },
      });
    });
  }

  public static async resetPassword({
    userId,
    next,
    previous,
  }: IUpdateStringValue) {
    const user = await Prisma.transact(client => {
      return client.user.findUnique({
        where: { id: userId },
        select: {
          password: true,
        },
      });
    });
    if (!user) {
      throw new GraphQLError("Something went wrong. Please try again");
    }
    if (!(await compare(previous, user.password))) {
      throw new GraphQLError("Your current password is incorrect");
    }
    await Prisma.transact(async client => {
      return client.user.update({
        where: { id: userId },
        data: {
          password: await hash(next, 10),
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
            orderBy: {
              createdAt: "asc",
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
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });
      });
    };
  }
}
