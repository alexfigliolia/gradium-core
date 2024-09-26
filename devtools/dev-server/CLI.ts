import { DevServer } from "@figliolia/typescript-dev-server";

(async () => {
  const Server = new DevServer({
    entryPoint: "src/Start.ts",
    serviceCommands: {
      postgres: "brew services start postgresql@14",
      redis: "brew services start redis",
    },
    killCommands: {
      postgres: "brew services stop postgresql@14",
      redis: "brew services stop redis",
    },
    nodeOptions: {
      NODE_ENV: "development",
      NODE_OPTIONS: "--enable-source-maps",
    },
  });
  await Server.run();
})().catch(console.log);
