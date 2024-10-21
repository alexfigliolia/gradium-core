import { v2 as cloudinary } from "cloudinary";
import type { IDestroySignature, IGradiumImage } from "GQL/Media/Types";
import { IGradiumImageType } from "GQL/Media/Types";
import { SecretManager } from "Secrets/Manager";

export class MediaClient {
  static #key?: string;
  static #name?: string;
  static #secret?: string;
  private static readonly directoryMap = {
    [IGradiumImageType.propertyImage]: "property_images",
    [IGradiumImageType.livingSpaceImage]: "living_space_images",
    [IGradiumImageType.livingSpaceFloorPlan]: "living_space_floor_plans",
    [IGradiumImageType.amenityImage]: "amenity_images",
    [IGradiumImageType.amenityFloorPlan]: "amenity_floor_plans",
    [IGradiumImageType.taskImage]: "task_images",
  };
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
    this.#key = key;
    this.#name = name;
    this.#secret = secret;
    cloudinary.config({
      api_key: key,
      cloud_name: name,
      api_secret: secret,
    });
    return cloudinary;
  }

  public static getConfiguration() {
    if (!this.#name || !this.#key || !this.#secret) {
      throw "Something went wrong";
    }
    return { name: this.#name, api_key: this.#key, secret: this.#secret };
  }

  public static signUpload = async (type: IGradiumImageType) => {
    const Client = await this.getClient();
    const folder = this.getAssetDesination(type);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const { secret, name, api_key } = MediaClient.getConfiguration();
    return {
      name,
      folder,
      api_key,
      timestamp,
      signature: Client.utils.api_sign_request(
        {
          folder,
          timestamp,
        },
        secret,
      ),
    };
  };

  public static signDestroy = async (
    imageType: IGradiumImageType,
    public_id: string,
  ) => {
    const Client = await this.getClient();
    const folder = this.getAssetDesination(imageType);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const { secret, name, api_key } = MediaClient.getConfiguration();
    const resource_type = "image";
    const invalidate = true;
    return {
      name,
      folder,
      api_key,
      public_id,
      timestamp,
      invalidate,
      resource_type,
      signature: Client.utils.api_sign_request(
        {
          timestamp,
          public_id,
          invalidate,
        },
        secret,
      ),
    };
  };

  public static destroyAssets(
    type: IGradiumImageType,
    ...images: IGradiumImage[]
  ) {
    return Promise.all(
      images.map(image => this.destroyAsset(type, this.toPublicID(image.url))),
    );
  }

  private static async destroyAsset(type: IGradiumImageType, publicId: string) {
    const signature = await this.signDestroy(type, publicId);
    const { name, ...rest } = signature;
    const data = new FormData();
    for (const K in rest) {
      const key = K as keyof Omit<IDestroySignature, "__typename" | "name">;
      data.append(key, rest[key].toString());
    }
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${name}/image/destroy`,
      {
        method: "POST",
        body: data,
      },
    );
    if (!response.ok) {
      throw "Failed to destroy cloudinary asset";
    }
    const json = await response.json();
    if (json?.result === "not found") {
      throw "Failed to destroy cloudinary asset";
    }
    return json;
  }

  private static getAssetDesination(type: IGradiumImageType) {
    const tokens: string[] = ["gradium"];
    if (!(type in this.directoryMap)) {
      throw new Error("Media Client: Unknown image type");
    }
    tokens.push(this.directoryMap[type]);
    return tokens.join("/");
  }

  private static toPublicID(url: string) {
    const tokens = url.split("/").slice(-3);
    const file = tokens
      .pop()!
      .replace(/([^.]+$)/, "")
      .slice(0, -1);
    tokens.push(file);
    return tokens.join("/");
  }
}
