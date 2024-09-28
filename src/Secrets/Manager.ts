import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export class SecretManager {
  public static client = new SecretManagerServiceClient();

  public static async getSecret(name: string) {
    let payload: string | undefined;
    if (process.env.NODE_ENV !== "production") {
      payload = process.env[name];
    } else {
      const [version] = await this.client.accessSecretVersion({
        name,
      });
      payload = version?.payload?.data?.toString?.();
    }
    if (!payload) {
      throw new Error(`Missing secret "${name}"`);
    }
    return payload;
  }

  public static getSecrets(...names: string[]) {
    return Promise.all(names.map(name => this.getSecret(name)));
  }
}
