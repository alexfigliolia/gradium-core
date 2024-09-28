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
    process.on("exit", this.killServices);
    process.on("SIGINT", this.killServices);
    process.on("SIGTERM", this.killServices);
  }

  private static killServices = () => {
    if (this.shuttingDown) {
      return;
    }
    this.shuttingDown = true;
    CoreLogger.silence();
    void SessionsClient.close();
    void Prisma.transact(client => client.$disconnect());
    this.Server?.close();
  };
}
