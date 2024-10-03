import { GraphQLError } from "graphql";
import { z, type ZodError } from "zod";

export class Validators {
  private static EMAIL_PARSER = z
    .string()
    .min(1, { message: "A valid email is required" })
    .email("A valid email is required");

  public static validateEmail(email: string) {
    try {
      this.EMAIL_PARSER.parse(email);
    } catch (e: any) {
      const error = e as ZodError;
      throw new GraphQLError(error.issues[0].message);
    }
  }

  public static validateName(name: string) {
    const tokens = name.split(" ");
    if (tokens.length > 1 && tokens.every(t => t.length > 1)) {
      return;
    }
    throw new GraphQLError("A valid name is required");
  }
}
