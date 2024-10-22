import type { Request } from "express";
import { GraphQLError } from "graphql";
import { PersonRole } from "@prisma/client";
import { Prisma } from "DB/Client";
import type { Session } from "Types/GraphQL";

export class Permission {
  public static MANAGER_OWNER_PERMISSION_ERROR = `You do not have permission to update this organization. To request permission, go to your account settings and request "manager" or "owner" permissions`;
  private static readonly permissions: Record<PersonRole, Set<PersonRole>> = {
    owner: new Set([
      PersonRole.owner,
      PersonRole.maintenance,
      PersonRole.manager,
    ]),
    manager: new Set([PersonRole.manager, PersonRole.maintenance]),
    resident: new Set([PersonRole.resident]),
    maintenance: new Set([PersonRole.maintenance]),
  };

  public static hasOrgAccess(
    session: Session,
    target: number,
  ): session is Omit<Session, "userID"> & { userID: number } {
    if (!this.knownUser(session)) {
      return false;
    }
    const orgs = session.organizations ?? [];
    return orgs.includes(target);
  }

  public static knownUser(
    session: Session,
  ): session is Omit<Session, "userID"> & { userID: number } {
    return typeof session.userID === "number";
  }

  public static matchesKnownUser(session: Session, userId: number) {
    return this.knownUser(session) && session.userID === userId;
  }

  public static async hasOrganizationPermissions(
    session: Session,
    org: number,
    ...permissions: PersonRole[]
  ) {
    if (!this.hasOrgAccess(session, org)) {
      return false;
    }
    const person = await Prisma.transact(client => {
      return client.person.findUnique({
        where: {
          identity: {
            userId: session.userID,
            organizationId: org,
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
    if (!person) {
      return false;
    }
    const perms: Set<PersonRole>[] = [];
    for (const { role } of person.roles) {
      perms.push(this.permissions[role]);
    }
    for (const permission of permissions) {
      if (perms.some(set => set.has(permission))) {
        return true;
      }
    }
    return false;
  }

  public static permissedTransaction<F extends (...args: any[]) => any>({
    session,
    operation,
    organizationId,
    permissions = [PersonRole.manager],
    errorMessage = "You do not have permission to modify this organization's data",
  }: {
    operation: F;
    session: Session;
    errorMessage?: string;
    organizationId: number;
    permissions?: PersonRole[];
  }) {
    return async (...args: Parameters<F>): Promise<ReturnType<F>> => {
      if (
        !(await Permission.hasOrganizationPermissions(
          session,
          organizationId,
          ...permissions,
        ))
      ) {
        throw new GraphQLError(errorMessage);
      }
      return operation(...args);
    };
  }

  public static createUserModifier<A extends { userId: number }>({
    operation,
    errorMessage,
  }: IUserModifierTransaction<A>) {
    return async (request: Request, args: A) => {
      if (!Permission.matchesKnownUser(request.session, args.userId)) {
        throw new GraphQLError(
          errorMessage ||
            "This operation can only be completed by the user that owns the underlying data",
        );
      }
      await operation(args);
    };
  }
}

export interface IUserModifierTransaction<T extends { userId: number }> {
  operation: (args: T) => any;
  errorMessage?: string;
}
