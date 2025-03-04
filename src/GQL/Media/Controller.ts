import { GraphQLError } from "graphql";
import { Permission } from "Tools/Permission";
import type { Session } from "Types/GraphQL";
import { DocumentController } from "./Documents";
import { ImageController } from "./Images";

export class MediaController {
  public static Images = new ImageController();
  public static Documents = new DocumentController();

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
