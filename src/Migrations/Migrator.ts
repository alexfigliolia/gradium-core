import type { SpawnOptions } from "node:child_process";
import { ChildProcess } from "@figliolia/child-process";
import { CoreLogger } from "Logger/Core";
import { SecretManager } from "Secrets/Manager";
import "dotenv/config";

export class Migrator {
  private static AUTH = SecretManager.getSecrets(
    "postgres-user",
    "postgres-password",
    "postgres-region",
  );
  public static run() {
    return this.exec("yarn prisma migrate deploy", "migration");
  }

  public static runReset() {
    return this.exec("yarn prisma db push", "reset");
  }

  public static baseline() {
    return this.exec(
      "yarn prisma migrate resolve --applied 0_init",
      "baseline",
    );
  }

  private static async exec(command: string, type: Operation) {
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
    const [user, password, region] = await this.AUTH;
    return `postgresql://${user}:${password}@${region}.supabase.com:${port}/postgres`;
  }
}

type Operation = "reset" | "migration" | "baseline";
