import { GraphQLError } from "graphql";
import type { Prisma as Client } from "@prisma/client";
import { Prisma } from "DB/Client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { Access } from "./Access";
import type { IFetchPeople } from "./Types";

export class PersonController extends Access {
  public static fetch = ({ organizationId, ...pagination }: IFetchPeople) => {
    return Prisma.transact(async client => {
      const pagingArgs = Prisma.paginationArguments(pagination);
      const results = await client.person.findMany({
        where: { organizationId },
        ...pagingArgs,
        orderBy: {
          user: {
            name: "asc",
          },
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      const list = results.map(this.toPersonType);
      return SchemaBuilder.toPaginationResult(list, pagingArgs.take);
    });
  };

  public static async fetchPerson<
    T extends Client.PersonSelect = typeof this.ROLE_SELECTION,
  >(organizationId: number, userId: number, access = this.ROLE_SELECTION as T) {
    return Prisma.transact(client => {
      return client.person.findUnique({
        where: {
          identity: {
            userId,
            organizationId,
          },
        },
        select: access,
      });
    });
  }

  public static async requirePersonID(userID: number, organizationId: number) {
    const person = await PersonController.fetchPerson(userID, organizationId, {
      id: true,
    });
    if (!person) {
      throw new GraphQLError(
        "This user's role within this organization was not found",
      );
    }
    return person.id;
  }

  public static toPersonType(data: {
    id: number;
    user: {
      name: string;
    };
  }) {
    return { id: data.id, name: data.user.name };
  }
}
