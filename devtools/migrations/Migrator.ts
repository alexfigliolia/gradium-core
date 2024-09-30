import type { SpawnOptions } from "node:child_process";
import { ChildProcess } from "@figliolia/child-process";
import { Prisma } from "DB/Client";
import { SecretManager } from "Secrets/Manager";

export class Migrator {
  public static async migrate() {
    const name = process.argv.slice(2)[0];
    if (!name) {
      console.log(
        `Please provide a name for your migration: "yarn migrate __name__"`,
      );
      process.exit();
    }
    const args = await this.createENV();
    await new ChildProcess(`yarn prisma migrate dev --name ${name}`, args)
      .handler;
  }

  public static async resetDB() {
    try {
      const env = await this.createENV();
      await new ChildProcess("yarn prisma migrate reset", env).handler;
      await new ChildProcess("yarn prisma db push", env).handler;
      await new ChildProcess("yarn clear-sessions", env).handler;
    } catch (error) {
      console.log("error", error);
    }
  }

  private static async createENV(): Promise<SpawnOptions> {
    const URL = await this.getURL();
    return {
      stdio: "inherit",
      env: {
        ...process.env,
        POSTGRES_SESSION_URL: URL,
        POSTGRES_TRANSACTION_URL: URL,
      },
    };
  }

  private static async getURL() {
    const [user, password] = await SecretManager.getSecrets(
      "postgres-user",
      "postgres-password",
    );
    return Prisma.connectionURL(user, password);
  }
}
