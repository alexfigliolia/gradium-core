import "dotenv/config";

export class CoreEnvironment {
  public static SSL = !!process.env.SSL;
  public static LOCAL = !!process.env.LOCAL;
  public static PORT = this.parsePort("PORT");
  public static REDIS_URL = this.accessOrThrow("REDIS_URL");
  public static AUTH_SECRET = this.accessOrThrow("AUTH_SECRET");
  public static UI_SERVICE_URL = this.accessOrThrow("UI_SERVICE_URL");
  public static POSTGRES_SESSION_URL = this.accessOrThrow(
    "POSTGRES_SESSION_URL",
  );
  public static POSTGRES_TRANSACTION_URL = this.accessOrThrow(
    "POSTGRES_TRANSACTION_URL",
  );

  private static accessOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable "${key}" is not set`);
    }
    return value;
  }

  private static parsePort(key: string) {
    const value = parseInt(this.accessOrThrow(key));
    if (isNaN(value)) {
      throw new Error(
        `Required environment variable "${key}" is not set to a valid port number`,
      );
    }
    return value;
  }
}
