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

  public static dateToTime(input: Date | string) {
    const date = typeof input === "string" ? new Date(input) : input;
    return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
  }

  public static populateTimeFrom(input: Date | string, base = new Date()) {
    const date = typeof input === "string" ? new Date(input) : input;
    base.setHours(date.getHours());
    base.setMinutes(date.getMinutes());
    base.setSeconds(date.getSeconds());
    base.setMilliseconds(0);
    return date;
  }

  public static populateDateFrom(base: Date | string, newDate = new Date()) {
    const baseDate = typeof base === "string" ? new Date(base) : base;
    newDate.setFullYear(baseDate.getFullYear());
    newDate.setMonth(baseDate.getMonth());
    newDate.setDate(baseDate.getDate());
    return newDate;
  }

  private static pad(value: number) {
    if (value < 10) {
      return `0${value}`;
    }
    return value.toString();
  }
}
