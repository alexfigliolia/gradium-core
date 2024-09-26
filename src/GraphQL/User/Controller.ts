import { Prisma } from "DB/Client";
import type { ISignUp } from "GraphQL/Login/Types";

export class UserController {
  public static findByEmail(email: string) {
    return Prisma.user.findUnique({ where: { email } });
  }

  public static findByID(id: number) {
    return Prisma.user.findUnique({ where: { id } });
  }

  public static createUser({ name, email, password }: ISignUp) {
    return Prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  public static authenticatedUserScope(id: number) {
    return Prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        affiliations: {
          select: {
            organizationId: true,
            roles: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
