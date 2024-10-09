import { GraphQLError } from "graphql";
import { PersonRole } from "@prisma/client";
import { Prisma } from "DB/Client";
import type { INameAndOrgID } from "GQL/Organization/Types";

export class PropertyController {
  private static NON_ALPHA_NUMERICS = new RegExp("[^A-Za-z0-9]");

  public static async fetch(userId: number, organizationId: number) {
    const access = await this.getUserAccess(userId, organizationId);
    if (access === "*") {
      return this.fetchAll(organizationId);
    }
    return this.fetchByIDs(organizationId, access);
  }

  public static fetchAll(organizationId: number) {
    return Prisma.transact(client => {
      return client.property.findMany({
        where: {
          organizationId,
        },
        include: {
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
        },
      });
    });
  }

  public static fetchByIDs(organizationId: number, ids: number[]) {
    return Prisma.transact(client => {
      return client.property.findMany({
        where: {
          organizationId,
          id: {
            in: ids,
          },
        },
        include: {
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
        },
      });
    });
  }

  public static create(args: INameAndOrgID) {
    return Prisma.transact(async client => {
      const exists = await client.property.findFirst({
        where: args,
        select: {
          id: true,
        },
      });
      if (exists) {
        throw new GraphQLError(
          `A property with this name already exists within your organization`,
        );
      }
      let attemps = 0;
      const max = 10;
      let appendage = "";
      while (attemps < max) {
        const slug = this.createSlug(args.name, appendage);
        if (await this.matchSlug(slug, args.organizationId)) {
          attemps++;
          appendage = (attemps + 1).toString();
          continue;
        }
        return client.property.create({
          data: {
            ...args,
            slug,
          },
          include: {
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
          },
        });
      }
      throw new GraphQLError(
        "We encountered an error creating your property. Would you mind trying a different name? It can always be updated later.",
      );
    });
  }

  private static createSlug(name: string, ...appendages: string[]) {
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

  private static matchSlug(slug: string, organizationId: number) {
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

  private static async getUserAccess(userId: number, organizationId: number) {
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
