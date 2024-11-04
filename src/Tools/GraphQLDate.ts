import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import { Dates } from "./Dates";

export const GraphQLDate = new GraphQLScalarType({
  name: "ISODate",
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new GraphQLError("Invalid date value passed to GraphQLDate");
  },
  parseValue(value) {
    if (typeof value !== "string" || !Dates.validateISO(value)) {
      throw new GraphQLError("Invalid ISO string passed to GraphQLDate");
    }
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Strings are required for GraphQLDate. Received: ${ast.kind}`,
      );
    }
    if (!Dates.validateISO(ast.value)) {
      throw new GraphQLError(
        `Invalid ISO string passed to GraphQLDate. Received: ${ast.value}`,
      );
    }
    return new Date(ast.value);
  },
});
