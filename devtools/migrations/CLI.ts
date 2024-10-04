import { DevMigrator } from "./DevMigrator";

(async () => {
  await DevMigrator.CLI();
})().catch(console.log);
