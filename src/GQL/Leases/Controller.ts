import { Prisma } from "DB/Client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { Access } from "./Access";
import type { ICreateLease, IFetchLeases, ILessee } from "./Types";

export class LeaseController extends Access {
  public static fetch = ({ organizationId, ...pagination }: IFetchLeases) => {
    const pagingArgs = Prisma.paginationArguments(pagination);
    return Prisma.transact(async client => {
      const leases = await client.lease.findMany({
        where: { organizationId },
        ...pagingArgs,
        select: this.DEFAULT_SELECTION,
      });
      return SchemaBuilder.toPaginationResult(leases, pagingArgs.take);
    });
  };

  public static create = async ({
    lessees,
    livingSpaceId,
    organizationId,
    ...data
  }: ICreateLease) => {
    const personIDs: number[] = [];
    const inviteEmails = new Map<string, string>(
      lessees.map(l => [l.email, l.name]),
    );
    const foundPeople = await this.findExistingLessees(organizationId, lessees);
    for (const person of foundPeople) {
      personIDs.push(person.id);
      inviteEmails.delete(person.linkedEmail.email);
    }
    const newLease = await Prisma.transact(client => {
      return client.lease.create({
        data: {
          ...data,
          organizationId,
          livingSpaceId,
          status: "pending",
          lessees: {
            connect: personIDs.map(id => ({
              id,
            })),
          },
          invites: {
            createMany: {
              data: Array.from(inviteEmails).map(([email, name]) => ({
                name,
                email,
                organizationId,
              })),
              skipDuplicates: true,
            },
          },
        },
        select: this.DEFAULT_SELECTION,
      });
    });
    return this.toGQL(newLease);
  };

  private static async findExistingLessees(
    organizationId: number,
    lessees: ILessee[],
  ) {
    return Prisma.transact(client => {
      return client.person.findMany({
        where: {
          AND: [
            { organizationId },
            {
              linkedEmail: {
                email: {
                  in: lessees.map(l => l.email),
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        select: {
          id: true,
          linkedEmail: {
            select: {
              email: true,
            },
          },
        },
      });
    });
  }
}
