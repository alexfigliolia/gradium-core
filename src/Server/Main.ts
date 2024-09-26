import bodyParser from "body-parser";
import RedisStore from "connect-redis";
import cors from "cors";
import type { Request, Response } from "express";
import session from "express-session";
import { createYoga } from "graphql-yoga";
import { CoreEnvironment } from "Environment/Core";
import { Schema } from "GQL/Schema";
import { CoreLogger } from "Logger/Core";
import { SessionsClient } from "Sessions/Client";
import { ProcessManager } from "./ProcessManager";

export class MainServer extends ProcessManager {
  public static async start() {
    this.listenForKills();
    await this.configureSessions();
    this.registerMiddleware();
    this.registerGraphQL();
    this.Server = this.APP.listen({ port: CoreEnvironment.PORT }, () => {
      CoreLogger.core("Server Running");
    });
    return this.Server;
  }

  private static registerMiddleware() {
    this.APP.use(
      cors({
        credentials: true,
        optionsSuccessStatus: 200,
        origin: CoreEnvironment.UI_SERVICE_URL,
      }),
    );
    this.APP.use(bodyParser.json());
    this.APP.use(bodyParser.urlencoded({ extended: true }));
    this.APP.set("trust proxy", 1);
  }

  private static async configureSessions() {
    await SessionsClient.start();
    this.APP.use(
      session({
        store: new RedisStore({ client: SessionsClient.Client }),
        secret: CoreEnvironment.AUTH_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          sameSite: true,
          httpOnly: true,
          maxAge: SessionsClient.MAX_AGE,
          secure: CoreEnvironment.SSL,
          expires: new Date(Date.now() + SessionsClient.MAX_AGE),
        },
      }),
    );
  }

  private static registerGraphQL() {
    CoreLogger.GQL("Mounting GraphQL");
    const yoga = createYoga({
      schema: Schema,
      graphqlEndpoint: "/graphql",
      graphiql: CoreEnvironment.LOCAL,
    });
    this.APP.use(
      yoga.graphqlEndpoint,
      (req: Request, res: Response) => void yoga(req, res),
    );
  }
}
