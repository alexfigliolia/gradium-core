import type { Request } from "express";
import { Prisma } from "DB/Client";
import type { ILoggedInUser } from "GraphQL/Login/Types";

export class SessionsManager {
  public static async validateSession(request: Request) {
    const { userID, organizations } = request.session;
    if (!userID || !organizations?.length) {
      return false;
    }
    const user = await Prisma.user.findUnique({
      where: { id: userID },
      select: {
        affiliations: {
          select: {
            organizationId: true,
          },
        },
      },
    });
    if (!user) {
      return false;
    }
    const set = new Set<number>(organizations);
    for (const { organizationId } of user.affiliations) {
      this.lookup(organizationId, set);
    }
    return set.size === 0;
  }

  public static setSessionData(user: ILoggedInUser, request: Request) {
    request.session.userID = user.id;
    request.session.organizations = user.affiliations.map(
      a => a.organizationId,
    );
  }

  public static destroySession(request: Request) {
    request.session.userID = null;
    request.session.organizations = null;
    return new Promise<void>((resolve, reject) => {
      request.session.destroy(error => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  private static lookup(id: number, set: Set<number>) {
    if (!set.has(id)) {
      return false;
    }
    set.delete(id);
    return true;
  }
}
