export class Dates {
  private static readonly VALIDATION_MAP = {
    month: {
      min: 1,
      max: 12,
    },
    day: {
      min: 1,
      max: 31,
    },
    hours: {
      min: 0,
      max: 23,
    },
    minutes_seconds: {
      min: 0,
      max: 59,
    },
  };

  public static validateISO(dateStr: string) {
    const [date, time] = dateStr.split("T");
    const [_, month, day] = date.split("-");
    if (
      !this.validToken(parseInt(month), "month") ||
      !this.validToken(parseInt(day), "day")
    ) {
      return false;
    }
    const [hours, minutes, precision] = time.split(":");
    if (
      !this.validToken(parseInt(hours), "hours") ||
      !this.validToken(parseInt(minutes), "minutes_seconds")
    ) {
      return false;
    }
    const [seconds, nano] = precision.split(".");
    return (
      this.validToken(parseInt(seconds), "minutes_seconds") &&
      nano.endsWith("Z")
    );
  }

  public static ISOTime(date: string) {
    const [_, time] = date.split("T");
    const [utcTime] = time.split(".");
    return utcTime;
  }

  private static validToken(
    int: number,
    key: keyof (typeof Dates)["VALIDATION_MAP"],
  ) {
    if (isNaN(int)) {
      return false;
    }
    const { min, max } = this.VALIDATION_MAP[key];
    return int >= min && int <= max;
  }
}
