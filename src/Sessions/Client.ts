import { createClient } from "redis";
import { CoreEnvironment } from "Environment/Core";
import { CoreLogger } from "Logger/Core";

export class SessionsClient {
  public static readonly MAX_AGE = 1000 * 60 * 60 * 24 * 30;
  public static Client = createClient({
    url: CoreEnvironment.REDIS_URL,
  });

  public static async start() {
    this.Client.on("connect", this.onConnection);
    this.Client.on("error", this.onError);
    await this.Client.connect();
    await this.Client.ping();
  }

  public static close() {
    this.Client.off("error", this.onError);
    this.Client.off("connect", this.onConnection);
    return this.Client.quit();
  }

  private static onConnection = () => {
    CoreLogger.redis("Connected to redis successfully");
  };

  private static onError = (error: any) => {
    CoreLogger.redis(error);
  };
}
