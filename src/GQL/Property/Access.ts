import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";

export class Access {
  private static NON_ALPHA_NUMERICS = new RegExp("[^A-Za-z0-9]");
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
        },
      });
    });
    if (!user) {
      throw new GraphQLError(
        "There were no accessible properties found. Please contact us",
      );
    }
    // TODO property access control by residency
    // if (user.roles.some(role => role.role === PersonRole.owner)) {
    return "*";
    // }
  }

  protected static createSlug(name: string, ...appendages: string[]) {
    const result: string[] = [];
    for (const char of name) {
      if (this.NON_ALPHA_NUMERICS.test(char)) {
        if (char === " " || char === "_") {
          result.push("-");
        }
      } else {
        result.push(char.toLowerCase());
      }
    }
    result.push(...appendages);
    return result.join("");
  }

  protected static allSlugs(organizationId: number) {
    return Prisma.transact(async client => {
      const slugs = await client.property.findMany({
        where: { organizationId },
        select: { slug: true },
      });
      return new Set(slugs.map(p => p.slug));
    });
  }

  protected static matchSlug(slug: string, organizationId: number) {
    return Prisma.transact(async client => {
      return client.property.findFirst({
        where: {
          slug,
          organizationId,
        },
        select: {
          id: true,
        },
      });
    });
  }
}
