import type { Request } from "express";

export class Locale {
  public static parseUserLanguage(request: Request) {
    return request.headers["accept-language"]?.split?.(",")?.[0] ?? "en-us";
  }
}
