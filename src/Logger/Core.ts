import chalk from "chalk";

export class CoreLogger {
  private static _LOG = console.log;
  private static LOG = this._LOG;

  public static silence() {
    this.LOG = () => {};
  }

  public static wake() {
    this.LOG = this._LOG;
  }

  public static redis = (...msg: any[]) => {
    this.LOG(chalk.redBright.bold("Redis:", ...msg));
  };

  public static core = (...msg: any[]) => {
    this.LOG(chalk.blueBright.bold("Core:", ...msg));
  };

  public static GQL = (...msg: any[]) => {
    this.LOG(chalk.greenBright.bold("GraphQL:", ...msg));
  };
}
