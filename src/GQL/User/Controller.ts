import { compare, hash } from "bcrypt";
import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import type { ICreateUser, IUpdateStringValue } from "./Types";

export class UserController {
  public static readonly SALTS = 10;

  public static findByEmail(email: string) {
    return Prisma.transact(async client => {
      const link = await client.linkedEmail.findUnique({
        where: { email },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              deleted: true,
              password: true,
            },
          },
        },
      });
      return link?.user;
    });
  }

  public static findAffiliationsByEmail(email: string) {
    return Prisma.transact(async client => {
      const link = await client.linkedEmail.findUnique({
        where: { email },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              affiliations: {
                select: {
                  linkedEmail: {
                    select: {
                      email: true,
                    },
                  },
                  roles: {
                    select: {
                      role: true,
                    },
                  },
                  organizationId: true,
                },
              },
            },
          },
        },
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
          password: await hash(next, UserController.SALTS),
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
}
