class Schedule {
  schedule: Map<string, DaySchedule>;

  constructor() {
    this.schedule = new Map();
  }

  private formatDate(date: Date): string {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  addDay(date: Date) {
    this.schedule.set(this.formatDate(date), new DaySchedule());
  }

  hasDay(date: Date): boolean {
    return this.schedule.has(this.formatDate(date));
  }

  getDay(date: Date): DaySchedule | undefined {
    let day = this.schedule.get(this.formatDate(date));

    return day;
  }
}

class DaySchedule {
  schedule: Map<string, string[]>;

  constructor() {
    this.schedule = new Map();
  }

  hasTimeslot(time: DayTime): boolean {
    return this.schedule.has(time.toString());
  }

  getTimeslot(time: DayTime): string[] | undefined {
    return this.schedule.get(time.toString());
  }

  addTimeslot(time: DayTime) {
    if (!this.hasTimeslot(time)) {
      this.schedule.set(time.toString(), []);
    }
  }

  addTeam(timeslot: DayTime, team: string) {
    if (!this.hasTimeslot(timeslot)) {
      this.addTimeslot(timeslot);
    }

    this.schedule.get(timeslot.toString())!.push(team);
  }
}

class DayTime {
  hour: number;
  minute: number;

  constructor(hourOrString: number | string, minute?: number) {
    if (typeof hourOrString === 'string') {
      // String constructor overload format "HH:MM"
      const hourString = hourOrString;
      const parts = hourString.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid time string');
      }
      this.hour = parseInt(parts[0]);
      this.minute = parseInt(parts[1]);
    } else {
      // Number constructor overload
      const hour = hourOrString;

      if (minute === undefined) {
        throw new Error('minute must be provided when using the number constructor overload');
      }

      if (hour < 0 || hour > 23) {
        throw new Error('hour must be between 0 and 23');
      }
      if (minute < 0 || minute > 59) {
        throw new Error('minute must be between 0 and 59');
      }

      this.hour = hourOrString;
      this.minute = minute;
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
    return `${this.hour}:${this.minute}`;
  }

  static fromMinutes(minutes: number): DayTime {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return new DayTime(hour, minute);
  }
}

export async function fetchMonthSchedule(month: number): Promise<Schedule> {
  // Check if month is valid
  if (month < 1 || month > 12) {
    throw new Error('month must be between 1 and 12');
  }

  const firstOfMonth = new Date(new Date().getFullYear(), month - 1, 1);

  // Check if month is in the future
  if (firstOfMonth < new Date()) {
    throw new Error('month must be in the future');
  }

  const now = new Date();

  // Get the weekOffset for the first day of the month
  const weekOffset = Math.ceil((firstOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));

  // Apply weekOffset on current date
  const weekOffsetCurrentDate = new Date();
  weekOffsetCurrentDate.setDate(weekOffsetCurrentDate.getDate() + 7 * weekOffset);


  // Get the number of days in the month
  const lastOfMonth = new Date(new Date().getFullYear(), month, 0);

  // Calculate the number of days between the weekOffsetCurrentDate and the last day of the month
  const days = Math.floor((lastOfMonth.getTime() - weekOffsetCurrentDate.getTime()) / (1000 * 60 * 60 * 24));

  const url = `https://data.sportlink.com/programma?gebruiklokaleteamgegevens=NEE&weekoffset=${weekOffset}&eigenwedstrijden=JA&thuis=JA&uit=NEE&client_id=${import.meta.env.VITE_API_KEY}&aantaldagen=${days}`;

  const response = await fetch(url);
  const data = await response.json();
  
  let schedule: Schedule = new Schedule();

  for (const game of data) {
    const dateString = game.kaledatum;

    // Date string is in format "YYYY-MM-DD 00:00:00.00"
    const parts = dateString.split(' ')[0].split('-');

    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

    // Check if game date is already in the schedules array
    if (!schedule.hasDay(date)) {
      schedule.addDay(date);
    }

    let day = schedule.getDay(date)!;

    const time = new DayTime(game.aanvangstijd);

    // Check if timeslot exists
    if (!day.hasTimeslot(time)) {
      day.addTimeslot(time);
    }

    day.addTeam(time, game.thuisteam);
  }
  return schedule;
}