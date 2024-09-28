import { compare, hash } from "bcrypt";
import { GraphQLError } from "graphql";
import { z, type ZodError } from "zod";
import { Prisma } from "DB/Client";
import { UserController } from "GQL/User/Controller";
import type { ILogin, ISignUp } from "GQL/User/Types";

export class LoginController {
  public static SALTS = 10;
  private static EMAIL_PARSER = z
    .string()
    .min(1, { message: "A valid email is required" })
    .email("A valid email is required");

  public static async login({ email, password }: ILogin) {
    this.validateEmail(email);
    this.validatePassword(password);
    const user = await UserController.findByEmail(email);
    if (!user) {
      throw new GraphQLError("This email address is not recognized");
    }
    if (!(await compare(password, user.password))) {
      throw new GraphQLError("Incorrect Password");
    }
    return UserController.authenticatedUserScope(user.id);
  }

  public static async signUp({ name, email, password }: ISignUp) {
    this.validateName(name);
    this.validateEmail(email);
    this.validatePassword(password);
    if (await UserController.findByEmail(email)) {
      throw new GraphQLError(`${name} is already a Gradium user. Please login`);
    }
    const pw = await hash(password, this.SALTS);
    const user = await UserController.createUser({ name, email, password: pw });
    await Prisma.transact(async client => {
      const org = await client.organization.create({
        data: {},
        select: { id: true },
      });
      const person = await client.person.create({
        data: {
          organizationId: org.id,
          userId: user.id,
        },
      });
      await client.role.create({
        data: {
          personId: person.id,
          role: "owner",
        },
      });
    });
    return UserController.authenticatedUserScope(user.id);
  }

  public static async sendPasswordResetEmail(email: string) {
    this.validateEmail(email);
    const user = await UserController.findByEmail(email);
    if (!user) {
      throw new GraphQLError("A user with this email address does not exist");
    }
    // send email
    return true;
  }

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

  public static validatePassword(password: string) {
    if (password.length < 5) {
      throw new GraphQLError("Passwords must be at lease 5 characters");
    }
  }
}
