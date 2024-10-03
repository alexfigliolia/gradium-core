import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { Permission } from "Tools/Permission";
import type { IOrganizationName } from "./Types";

export class OrganizationController {
  public static async setName(
    { name, organizationId }: IOrganizationName,
    request: Request,
  ) {
    if (
      !(await Permission.hasOrganizationPermissions(
        request.session,
        organizationId,
        "owner",
        "manager",
      ))
    ) {
      throw new GraphQLError(Permission.MANAGER_OWNER_PERMISSION_ERROR);
    }
    await Prisma.transact(client => {
      return client.organization.update({
        where: {
          id: organizationId,
        },
        data: {
          name,
        },
      });
    });
    return true;
  }
}
