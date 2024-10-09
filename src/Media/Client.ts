import { v2 as cloudinary } from "cloudinary";
import { SecretManager } from "Secrets/Manager";

export class MediaClient {
  private static _Client?: typeof cloudinary;

  public static async getClient() {
    if (!this._Client) {
      this._Client = await this.createClient();
    }
    return this._Client;
  }

  private static async createClient() {
    const [key, name, secret] = await Promise.all([
      SecretManager.getSecret("cloudinary-key", true),
      SecretManager.getSecret("cloudinary-name", true),
      SecretManager.getSecret("cloudinary-secret", true),
    ]);
    cloudinary.config({
      api_key: key,
      cloud_name: name,
      api_secret: secret,
    });
    return cloudinary;
  }
}
