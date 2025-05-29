import { PrismaClient } from "@prisma/client";
import { SecretManager } from "Secrets/Manager";
import type { IPagination } from "Types/GraphQL";

export class Prisma {
  private static Client?: PrismaClient;

  public static async transact<T>(callback: (client: PrismaClient) => T) {
    return callback(await this.getClient());
  }

  private static async getClient() {
    if (this.Client) {
      return this.Client;
    }
    const [user, password, region] = await SecretManager.getSecrets(
      "postgres-user",
      "postgres-password",
      "postgres-region",
    );
    this.Client = new PrismaClient({
      datasources: {
        db: {
          url: this.connectionURL(user, password, region),
        },
      },
    });
    return this.Client;
  }

  public static connectionURL(user: string, password: string, region: string) {
    if (process.env.NODE_ENV !== "production") {
      return `postgresql://${user}:${password}@${region}:5432/gradium`;
    }
    return `postgresql://${user}:${password}@${region}.supabase.com:5432/postgres`;
  }

  public static paginationArguments({ cursor, limit }: IPagination) {
    const hasCursor = typeof cursor === "number";
    return {
      cursor: hasCursor
        ? {
            id: cursor,
          }
        : undefined,
      skip: hasCursor ? 1 : 0,
      take: limit ?? 10,
    };
  }
}
