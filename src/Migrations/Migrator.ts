import type { SpawnOptions } from "node:child_process";
import { ChildProcess } from "@figliolia/child-process";
import { CoreLogger } from "Logger/Core";
import { SecretManager } from "Secrets/Manager";
import "dotenv/config";

export class Migrator {
  private static AUTH = SecretManager.getSecrets(
    "postgres-user",
    "postgres-password",
  );
  public static run() {
    return this.exec("yarn prisma migrate deploy", "migration");
  }

  public static runReset() {
    return this.exec("yarn prisma db push", "reset");
  }

  private static async exec(command: string, type: "reset" | "migration") {
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    try {
      const env = await this.createENV();
      await new ChildProcess(command, env).handler;
    } catch (error) {
      CoreLogger.core(`DB ${type} Failed. Terminating process`, error);
      throw error;
    }
  }

  private static async createENV(): Promise<SpawnOptions> {
    const [sessionURL, transactionURL] = await Promise.all([
      this.connectionURL(5432),
      this.connectionURL(6543),
    ]);
    return {
      stdio: "inherit",
      env: {
        ...process.env,
        POSTGRES_SESSION_URL: sessionURL,
        POSTGRES_TRANSACTION_URL: `${transactionURL}?pgbouncer=true&connection_limit=1`,
      },
    };
  }

  private static async connectionURL(port: number) {
    const [user, password] = await this.AUTH;
    return `postgresql://${user}:${password}@aws-0-us-west-1.pooler.supabase.com:${port}/postgres`;
  }
}
