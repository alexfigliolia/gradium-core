import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { CoreLogger } from "Logger/Core";

export class SecretManager {
  public static client = new SecretManagerServiceClient();

  public static async getSecret(name: string, bypass = false) {
    let payload: string | undefined;
    this.bypassWarning(name, bypass);
    if (process.env.NODE_ENV !== "production" && !bypass) {
      payload = process.env[name];
    } else {
      const [version] = await this.client.accessSecretVersion({
        name: `projects/gradium-436914/secrets/${name}/versions/latest`,
      });
      payload = version?.payload?.data?.toString?.();
    }
    if (typeof payload === "undefined") {
      throw new Error(`Missing secret "${name}"`);
    }
    return payload;
  }

  public static getSecrets(...names: string[]) {
    return Promise.all(names.map(name => this.getSecret(name)));
  }

  private static bypassWarning(name: string, bypass?: boolean) {
    if (bypass && process.env.NODE_ENV !== "production") {
      CoreLogger.warn("Using production environment credentials for", name);
    }
  }
}
