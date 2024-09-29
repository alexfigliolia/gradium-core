import "dotenv/config";

export class CoreEnvironment {
  public static SSL = !!process.env.SSL;
  public static LOCAL = !!process.env.LOCAL;
  public static PORT = this.parsePort("PORT");

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
