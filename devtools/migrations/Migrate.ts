import { Migrator } from "./Migrator";

(async () => {
  await Migrator.migrate();
})().catch(console.log);
