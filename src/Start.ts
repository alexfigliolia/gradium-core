import { CoreLogger } from "Logger/Core";
import { MainServer } from "Server/Main";

(async () => {
  await MainServer.start();
})().catch(CoreLogger.core);
