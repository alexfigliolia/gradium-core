import { Prisma } from "DB/Client";
import type { ISignUp } from "./Types";

export class UserController {
  public static findByEmail(email: string) {
    return Prisma.transact(client => {
      return client.user.findUnique({ where: { email } });
    });
  }

  public static findByID(id: number) {
    return Prisma.transact(client => {
      return client.user.findUnique({ where: { id } });
    });
  }

  public static createUser({ name, email, password }: ISignUp) {
    return Prisma.transact(client => {
      return client.user.create({
        data: {
          name,
          email,
          password,
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
          email: true,
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
