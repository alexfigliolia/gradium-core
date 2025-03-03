import type { Request } from "express";
import { GraphQLError } from "graphql";
import { PersonRole } from "@prisma/client";
import { Prisma } from "DB/Client";
import { PersonController } from "GQL/Person/Controller";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { Validators } from "Tools/Validators";
import type { IFetchStaff, IInviteStaffMember } from "./Types";

export class StaffController {
  public static async invite(
    { email, organizationId }: IInviteStaffMember,
    request: Request,
  ) {
    Validators.validateEmail(email);
    if (
      await Permission.hasOrganizationPermissions(
        request.session,
        organizationId,
        "owner",
        "manager",
      )
    ) {
      await Prisma.transact(client => {
        return client.staffInvite.create({
          data: {
            email,
            organizationId,
          },
        });
      });
      return true;
    }
    throw new GraphQLError(Permission.MANAGER_OWNER_PERMISSION_ERROR);
  }

  public static async fetchStaffMembers({
    organizationId,
    ...pagination
  }: IFetchStaff) {
    const staff = await Prisma.transact(client => {
      return client.person.findMany({
        where: {
          AND: [
            { organizationId },
            {
              roles: {
                some: {
                  role: {
                    in: [
                      PersonRole.owner,
                      PersonRole.manager,
                      PersonRole.maintenance,
                    ],
                  },
                },
              },
            },
          ],
        },
        ...Prisma.paginationArguments(pagination),
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
    });
    return SchemaBuilder.toPaginationResult(
      staff.map(PersonController.toPersonType),
    );
  }
}
