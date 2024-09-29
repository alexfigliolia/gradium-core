import { Migrator } from "Migrations/Migrator";
import { MainServer } from "Server/Main";

(async () => {
  await Migrator.run();
  await MainServer.start();
})();
