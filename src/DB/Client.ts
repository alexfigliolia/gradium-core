import { PrismaClient } from "@prisma/client";
import { Manager } from "Secrets/Manager";

export class Prisma {
  private static Client?: PrismaClient;

  public static async transact<T>(callback: (client: PrismaClient) => T) {
    return callback(await this.getClient());
  }

  private static async getClient() {
    if (this.Client) {
      return this.Client;
    }
    const [user, password] = await Manager.getSecrets(
      "postgres-user",
      "postgres-password",
    );
    this.Client = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://${user}:${password}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
        },
      },
    });
    return this.Client;
  }
}
