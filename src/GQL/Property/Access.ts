import { GraphQLError } from "graphql";
import { PersonRole } from "@prisma/client";
import { Prisma } from "DB/Client";

export class Access {
  public static readonly BASIC_ATTRIBUTE_SELECTION = {
    addons: {
      select: {
        id: true,
        type: true,
      },
    },
    images: {
      select: {
        id: true,
        url: true,
      },
    },
  } as const;

  public static async getUserAccess(userId: number, organizationId: number) {
    const user = await Prisma.transact(client => {
      return client.person.findUnique({
        where: {
          identity: {
            userId,
            organizationId,
          },
        },
        select: {
          roles: {
            select: {
              role: true,
            },
          },
          staffProfile: {
            select: {
              propertyAccess: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
    });
    if (!user) {
      throw new GraphQLError(
        "There were no accessible properties found. Please contact us",
      );
    }
    if (user.roles.some(role => role.role === PersonRole.owner)) {
      return "*";
    }
    if (!user.staffProfile) {
      return [];
    }
    return user.staffProfile.propertyAccess.map(p => p.id);
  }
}
