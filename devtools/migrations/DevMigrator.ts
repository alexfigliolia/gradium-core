import type { SpawnOptions } from "node:child_process";
import { ChildProcess } from "@figliolia/child-process";
import { Prisma } from "DB/Client";
import { SecretManager } from "Secrets/Manager";

export class DevMigrator {
  private static flags = new Set([
    "--push",
    "--migrate",
    "--reset",
    "--reset-data",
    "--exec",
  ]);

  public static CLI() {
    const [command, ...rest] = process.argv.slice(2);
    if (!this.recognizedCommand(command)) {
      this.commandError(command);
    }
    switch (command) {
      case "--push":
        return this.push();
      case "--migrate":
        return this.migrate(...rest);
      case "--reset":
        return this.resetDB();
      case "--reset-data":
        return this.resetData();
      case "--exec":
        return this.exec(...rest);
      default:
        return this.commandError(command);
    }
  }

  public static async migrate(...args: string[]) {
    const name = args[0];
    if (!name) {
      console.log(
        `Please provide a name for your migration: "yarn migration --migrate __name__"`,
      );
      process.exit();
    }
    await new ChildProcess(
      `yarn prisma migrate dev --name ${name}`,
      await this.createENV(),
    ).handler;
  }

  public static async push() {
    return new ChildProcess("yarn prisma db push", await this.createENV())
      .handler;
  }

  public static async resetDB() {
    const env = await this.createENV();
    await new ChildProcess("yarn prisma migrate reset", env).handler;
    await new ChildProcess("yarn prisma db push", env).handler;
    await new ChildProcess("yarn clear-sessions", env).handler;
  }

  public static async resetData() {
    const env = await this.createENV();
    await new ChildProcess("yarn prisma db push --force-reset", env).handler;
    await new ChildProcess("yarn clear-sessions").handler;
  }

  public static async exec(...args: string[]) {
    const env = await this.createENV();
    await new ChildProcess(args.join(" "), env).handler;
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
    const [user, password, region] = await SecretManager.getSecrets(
      "postgres-user",
      "postgres-password",
      "postgres-region",
    );
    return Prisma.connectionURL(user, password, region);
  }

  private static recognizedCommand(command: string) {
    if (this.flags.has(command)) {
      return true;
    }
    return false;
  }

  private static commandError(command: string) {
    console.log(`The "${command}" command is not recognized`);
    process.exit(0);
  }
}
