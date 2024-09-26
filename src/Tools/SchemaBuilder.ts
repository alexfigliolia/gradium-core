import type { GraphQLNullableType } from "graphql";
import { GraphQLList, GraphQLNonNull } from "graphql";

export class SchemaBuilder {
  public static nonNull<T extends GraphQLNullableType>(type: T) {
    return new GraphQLNonNull(type);
  }

  public static nonNullArray<T extends GraphQLNullableType>(type: T) {
    return new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)));
  }
}
