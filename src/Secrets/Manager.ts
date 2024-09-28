import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export class Manager {
  public static client = new SecretManagerServiceClient();

  public static async getSecret(name: string) {
    const [version] = await this.client.accessSecretVersion({
      name,
    });
    const payload = version?.payload?.data?.toString?.();
    if (!payload) {
      throw new Error(`Missing secret "${name}"`);
    }
    return payload;
  }

  public static getSecrets(...names: string[]) {
    return Promise.all(names.map(name => this.getSecret(name)));
  }
}
