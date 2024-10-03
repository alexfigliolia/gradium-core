import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { Permission } from "Tools/Permission";
import { Validators } from "Tools/Validators";
import type { IInviteStaffMember } from "./Types";

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
}
