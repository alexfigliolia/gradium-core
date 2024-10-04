import { Migrator } from "./Migrator";

(async () => {
  await Migrator.CLI();
})().catch(console.log);
