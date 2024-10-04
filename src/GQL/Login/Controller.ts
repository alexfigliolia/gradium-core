import { compare, hash } from "bcrypt";
import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { UserController } from "GQL/User/Controller";
import type { ILogin, ISignUp } from "GQL/User/Types";
import { Validators } from "Tools/Validators";

export class LoginController {
  public static SALTS = 10;

  public static async login({ email, password }: ILogin) {
    const user = await this.validateLoginEmail(email);
    if (!(await compare(password, user.password))) {
      throw new GraphQLError("Incorrect Password");
    }
    return UserController.authenticatedUserScope(user.id);
  }

  public static async signUp({ name, email, password }: ISignUp) {
    Validators.validateName(name);
    Validators.validateEmail(email);
    this.validatePassword(password);
    if (await UserController.findByEmail(email)) {
      throw new GraphQLError(`${name} is already a Gradium user. Please login`);
    }
    const pw = await hash(password, this.SALTS);
    const { id: userId } = await UserController.createUser({
      name,
      password: pw,
    });
    await Prisma.transact(async client => {
      const { id: linkId } = await client.linkedEmail.create({
        data: {
          email,
          userId,
        },
      });
      const { id: orgId } = await client.organization.create({
        data: {},
        select: { id: true },
      });
      const person = await client.person.create({
        data: {
          userId,
          linkedEmailId: linkId,
          organizationId: orgId,
        },
      });
      await client.role.create({
        data: {
          personId: person.id,
          role: "owner",
        },
      });
    });
    return UserController.authenticatedUserScope(userId);
  }

  public static async sendPasswordResetEmail(email: string) {
    Validators.validateEmail(email);
    const user = await UserController.findByEmail(email);
    if (!user) {
      throw new GraphQLError("This email address is not recognized");
    }
    // send email
    return "We've sent you an email with instructions to reset your password";
  }

  public static validatePassword(password: string) {
    if (password.length < 5) {
      throw new GraphQLError("Passwords must be at lease 5 characters");
    }
  }

  private static async validateLoginEmail(email: string) {
    try {
      Validators.validateEmail(email);
      const user = await UserController.findByEmail(email);
      if (!user) {
        throw "Exit";
      }
      return user;
    } catch (error) {
      throw new GraphQLError("This email address is not recognized");
    }
  }
}
