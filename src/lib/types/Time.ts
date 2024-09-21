export class Time {
  constructor(public hour: number, public minute: number) {
    if (minute < 0 || minute > 59) {
      throw new Error('minute must be between 0 and 59');
    }
  }
  
  // Overload for comparison
  equals(other: DayTime): boolean {
    return this.hour === other.hour && this.minute === other.minute;
  }

  asMinutes(): number {
    return this.hour * 60 + this.minute;
  }

  toString(): string {
    // Return time in format "HH:MM"
    return `${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
  }

  static fromMinutes(minutes: number): DayTime {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return new DayTime(hour, minute);
  }

  static fromString(time: string): DayTime {
    const parts = time.split(':');

    const hour = parseInt(parts[0]);
    const minute = parseInt(parts[1]);

    return new DayTime(hour, minute);
  }

  addTime(time: Time) {
    this.minute += time.minute;

    while (this.minute >= 60) {
      this.minute -= 60;
      this.hour += 1;
    }

    this.hour += time.hour;
  }

  static addTime(time1: Time, time2: Time): Time {
    let retTime = new Time(time1.hour, time1.minute);
    retTime.addTime(time2);

    return retTime;
  }

  compare(time: Time): number {
    if (this.hour > time.hour) {
      return 1;
    } else if (this.hour < time.hour) {
      return -1;
    } else if (this.minute > time.minute) {
      return 1;
    } else if (this.minute < time.minute) {
      return -1;
    } else {
      return 0;
    }
  }
}

export class DayTime extends Time {
  constructor(hour: number, minute: number) {
    if (hour < 0 || hour > 23) {
      throw new Error('hour must be between 0 and 23');
    }
    
    super(hour, minute);
  }

  addTime(time: Time) {
    super.addTime(time);

    while (this.hour >= 24) {
      this.hour -= 24;
    }
  }
}