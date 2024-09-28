export class Time {
  constructor(public hour: number, public minute: number) {
    if (minute < -59 || minute > 59) {
      throw new Error('minute must be between -59 and 59');
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

  valueOf(): string {
    return this.toString();
  }

  static fromMinutes(minutes: number): DayTime {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return new Time(hour, minute);
  }

  static fromString(time: string): Time {
    const parts = time.split(':');

    const hour = parseInt(parts[0]);
    const minute = parseInt(parts[1]);

    return new Time(hour, minute);
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

export class Datum {
  
  // Date string is ALWAYS in format "YYYY-MM-DD"
  private dateString: string;

  constructor(dateString: string) {
    // Check if dateString is in correct format
    if (!RegExp(/^\d{4}-\d{2}-\d{2}$/).exec(dateString)) {
      // Date string is not in correct format
      // Try reformating it from "DD-MM-YYYY" to "YYYY-MM-DD"
      
      // Check if dateString is in format "DD-MM-YYYY"
      if(RegExp(/^\d{2}-\d{2}-\d{4}$/).exec(dateString)) {
        // dateString is in format "DD-MM-YYYY"
        // Reformate it to "YYYY-MM-DD"
        const parts = dateString.split('-');
        dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        // dateString is not in format "DD-MM-YYYY"
        throw new Error('dateString is not in correct format');
      }
    }

    this.dateString = dateString;
  }

  static fromDate(date: Date): Datum {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return new Datum(`${year}-${month}-${day}`);
  }
  
  valueOf(): string {
    return this.dateString;
  }

  toString(): string {
    return this.dateString;
  }

  toPrettyString() {
    const parts = this.dateString.split('-');
    
    // Convert month number to month name in Dutch
    const months = [
      "januari", "februari", "maart", "april", "mei", "juni",
      "juli", "augustus", "september", "oktober", "november", "december"
    ];

    const month = parseInt(parts[1]);

    return `${parseInt(parts[2])} ${months[month - 1]} ${parts[0]}`;
  }
}