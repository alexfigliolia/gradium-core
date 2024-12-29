import type { Prisma as IPrisma } from "@prisma/client";
import type { IlistManagementTasks } from "./Types";

export class Access {
  public static readonly DEFAULT_SELECTION = {
    id: true,
    createdAt: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    images: {
      select: {
        id: true,
        url: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    },
    assignedTo: {
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    },
    expenses: {
      select: {
        id: true,
        cost: true,
        title: true,
        createdAt: true,
        description: true,
        attachments: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    },
  };

  public static buildFilterCombinator({
    organizationId,
    propertyId,
    searchString,
    assignedToId,
    priority,
  }: IlistManagementTasks) {
    const combinator: IPrisma.ManagementTaskWhereInput[] = [{ organizationId }];
    if (propertyId) {
      combinator.push({ propertyId });
    }
    if (searchString) {
      const search = searchString.toLowerCase();
      combinator.push({
        // TODO - fuzzy
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      });
    }
    if (assignedToId?.length) {
      combinator.push({
        assignedToId: {
          in: assignedToId,
        },
      });
    }
    if (priority?.length) {
      combinator.push({
        priority: {
          in: priority,
        },
      });
    }
    return combinator;
  }
}
