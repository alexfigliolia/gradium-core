import { Migrator } from "../migrate/Migrator";

(async () => {
  await Migrator.run();
})().catch(console.log);
