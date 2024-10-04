import { ChildProcess } from "@figliolia/child-process";
import { CoreLogger } from "Logger/Core";
import { SecretManager } from "Secrets/Manager";
import "dotenv/config";

export class Migrator {
  private static AUTH = SecretManager.getSecrets(
    "postgres-user",
    "postgres-password",
  );
  public static async run() {
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    try {
      const [sessionURL, transactionURL] = await Promise.all([
        this.connectionURL(5432),
        this.connectionURL(6543),
      ]);
      await new ChildProcess("yarn prisma migrate deploy", {
        stdio: "inherit",
        env: {
          ...process.env,
          POSTGRES_SESSION_URL: sessionURL,
          POSTGRES_TRANSACTION_URL: `${transactionURL}?pgbouncer=true&connection_limit=1`,
        },
      }).handler;
    } catch (error) {
      CoreLogger.core("Migrations Failed. Terminating process", error);
      throw error;
    }
  }

  private static async connectionURL(port: number) {
    const [user, password] = await this.AUTH;
    return `postgresql://${user}:${password}@aws-0-us-west-1.pooler.supabase.com:${port}/postgres`;
  }
}
