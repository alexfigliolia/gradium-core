import type { GraphQLFieldConfig } from "graphql";
import { GraphQLBoolean, GraphQLInt, GraphQLString } from "graphql";
import { PaginatedIdentitiesType } from "Tools/GraphQLIdentity";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { type Context, PaginationArgs } from "Types/GraphQL";
import { StaffController } from "./Controller";
import type { IFetchStaff, IInviteStaffMember } from "./Types";

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

export const listStaffMembers: GraphQLFieldConfig<any, Context, IFetchStaff> = {
  type: SchemaBuilder.nonNull(PaginatedIdentitiesType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    ...PaginationArgs,
  },
  resolve: (_, args, context) => {
    const operation = Permission.permissedTransaction({
      operation: StaffController.fetchStaffMembers,
      organizationId: args.organizationId,
      session: context.req.session,
      errorMessage:
        "You do not have permission to access a list of staff members",
    });
    return operation(args);
  },
};
