import type { GraphQLNullableType } from "graphql";
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import type { Context, DBID, IPaginationResult } from "Types/GraphQL";

export class SchemaBuilder {
  public static nonNull<T extends GraphQLNullableType>(type: T) {
    return new GraphQLNonNull(type);
  }

  public static nonNullArray<T extends GraphQLNullableType>(type: T) {
    return new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)));
  }

  public static paginatedType<T extends Record<string, any>>(
    name: string,
    type: GraphQLObjectType,
  ) {
    return new GraphQLObjectType<IPaginationResult<T>, Context>({
      name,
      fields: {
        list: {
          type: SchemaBuilder.nonNullArray(type),
          resolve: result => result.list,
        },
        cursor: {
          type: GraphQLInt,
          resolve: result => result.cursor,
        },
      },
    });
  }

  public static toPaginationResult<T extends DBID>(list: T[]) {
    return { list, cursor: list?.[list.length - 1]?.id };
  }
}
