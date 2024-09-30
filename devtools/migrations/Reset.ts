import { Migrator } from "./Migrator";

(async () => {
  await Migrator.resetDB();
})().catch(console.log);
