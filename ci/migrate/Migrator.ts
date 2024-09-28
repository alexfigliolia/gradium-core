import { ChildProcess } from "@figliolia/child-process";

export class Migrator {
  public static POSTGRES_USER = this.accessOrThrow("POSTGRES_USER");
  public static POSTGRES_PASSWORD = this.accessOrThrow("POSTGRES_PASSWORD");

  public static run() {
    return new ChildProcess("yarn prisma migrate deploy", {
      env: {
        ...process.env,
        POSTGRES_SESSION_URL: this.connectionURL(5432),
        POSTGRES_TRANSACTION_URL: `${this.connectionURL(6543)}?pgbouncer=true&connection_limit=1`,
      },
    }).handler;
  }

  private static connectionURL(port: number) {
    return `postgresql://${this.POSTGRES_USER}:${this.POSTGRES_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:${port}/postgres`;
  }

  private static accessOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
      console.log(`Environment Variable "${key}" is not set`);
      process.exit(1);
    }
    return value;
  }
}
