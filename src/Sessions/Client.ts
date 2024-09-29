import { createClient } from "redis";
import { CoreLogger } from "Logger/Core";
import { SecretManager } from "Secrets/Manager";

export class SessionsClient {
  private static instance?: ReturnType<typeof createClient>;
  public static readonly MAX_AGE = 1000 * 60 * 60 * 24 * 30;

  public static async getClient() {
    if (this.instance) {
      return this.instance;
    }
    const password = await SecretManager.getSecret("redis-password");
    const Client = createClient({
      url: this.connectionURL(password),
    });
    this.instance = Client;
    return Client;
  }

  public static async start() {
    const Client = await this.getClient();
    Client.on("connect", this.onConnection);
    Client.on("error", this.onError);
    await Client.connect();
    await Client.ping();
    return Client;
  }

  public static async close() {
    const Client = await this.getClient();
    Client.off("error", this.onError);
    Client.off("connect", this.onConnection);
    return Client.quit();
  }

  private static onConnection = () => {
    CoreLogger.redis("Connected to redis successfully");
  };

  private static onError = (error: any) => {
    CoreLogger.redis(error);
  };

  private static connectionURL(password: string) {
    if (process.env.NODE_ENV !== "production") {
      return `redis://:${password}@localhost:6379`;
    }
    return `rediss://default:${password}@gusc1-present-grouper-30100.upstash.io:30100`;
  }
}
