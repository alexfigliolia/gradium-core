import type { GraphQLFieldConfig } from "graphql";
import { GraphQLBoolean, GraphQLInt, GraphQLString } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { StaffController } from "./Controller";
import type { IInviteStaffMember } from "./Types";

export const inviteStaffMember: GraphQLFieldConfig<
  any,
  Context,
  IInviteStaffMember
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, args, context) => {
    return StaffController.invite(args, context.req);
  },
};
