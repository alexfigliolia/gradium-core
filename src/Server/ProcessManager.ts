import { default as Express } from "express";
import { type Server as HTTP1Server } from "http";
import { type Server as HTTP2Server } from "spdy";
import { Prisma } from "DB/Client";
import { CoreLogger } from "Logger/Core";
import { SessionsClient } from "Sessions/Client";

export class ProcessManager {
  private static shuttingDown = false;
  public static APP = Express();
  public static Server?: HTTP2Server | HTTP1Server;

  public static listenForKills() {
    process.on("exit", this.close);
    process.on("SIGINT", this.close);
    process.on("SIGTERM", this.close);
  }

  public static close = () => {
    void this.closeAsync();
  };

  public static async closeAsync() {
    if (this.shuttingDown) {
      return;
    }
    this.shuttingDown = true;
    CoreLogger.silence();
    this.Server?.close();
    await Promise.all([
      SessionsClient.close(),
      Prisma.transact(client => client.$disconnect()),
    ]);
    process.exit(0);
  }
}
