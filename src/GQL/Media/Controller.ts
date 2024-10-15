import { GraphQLError } from "graphql";
import { Permission } from "Tools/Permission";
import type { Session } from "Types/GraphQL";

export class MediaController {
  public static verify(session: Session, organizationId: number) {
    if (!Permission.hasOrgAccess(session, organizationId)) {
      throw new GraphQLError("You do not have access to this organization");
    }
  }

  public static wrapSignature<F extends (...args: any[]) => any>(
    operation: F,
    ...args: Parameters<F>
  ) {
    try {
      const destination = operation(...args);
      return destination;
    } catch (error) {
      throw new GraphQLError("Something went wrong. Please try again");
    }
  }
}
