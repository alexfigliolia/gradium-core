import type { SpawnOptions } from "node:child_process";
import { ChildProcess } from "@figliolia/child-process";
import { Prisma } from "DB/Client";
import { SecretManager } from "Secrets/Manager";

export class DevMigrator {
  private static flags = new Set(["--migrate", "--reset", "--reset-hard"]);

  public static CLI() {
    const [command, ...rest] = process.argv.slice(2);
    if (!this.recognizedCommand(command)) {
      this.commandError(command);
    }
    switch (command) {
      case "--migrate":
        return this.migrate(...rest);
      case "--reset":
        return this.resetDB();
      case "--reset-hard":
        return this.resetHard();
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

  public static async resetDB() {
    const env = await this.createENV();
    await new ChildProcess("yarn prisma migrate reset", env).handler;
    await new ChildProcess("yarn prisma db push", env).handler;
    await new ChildProcess("yarn clear-sessions", env).handler;
  }

  public static async resetHard() {
    const env = await this.createENV();
    await new ChildProcess("yarn prisma db push --force-reset", env).handler;
    await new ChildProcess("npx prisma db seed", env).handler;
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

  private static recognizedCommand(
    command: string | Command,
  ): command is Command {
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

type Command = "--migrate" | "--reset" | "--reset-hard";
