import type { Request } from "express";
import { Prisma } from "DB/Client";
import type { ILoggedInUser } from "GQL/User/Types";

export class SessionsManager {
  public static async validateSession(request: Request) {
    const { userID, organizations } = request.session;
    if (!userID || !organizations?.length) {
      await this.destroySession(request);
      return false;
    }
    const user = await Prisma.transact(client => {
      return client.user.findUnique({
        where: { id: userID },
        select: {
          affiliations: {
            select: {
              organizationId: true,
            },
          },
        },
      });
    });
    if (!user) {
      await this.destroySession(request);
      return false;
    }
    let update = false;
    const set = new Set<number>(organizations);
    for (const { organizationId } of user.affiliations) {
      if (set.has(organizationId)) {
        set.delete(organizationId);
      } else {
        update = true;
      }
    }
    if (update || set.size !== 0) {
      request.session.organizations = user.affiliations.map(
        a => a.organizationId,
      );
    }
    return true;
  }

  public static setSessionData(user: ILoggedInUser, request: Request) {
    request.session.userID = user.id;
    request.session.organizations = user.affiliations.map(
      a => a.organization.id,
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
}
