import * as DB from "$lib/db/types";
import { Datum, DayTime, Time } from "./Time";

export class ReportMonth {
  id: number;
  month: string;

  constructor(id: number, month: string) {
    this.id = id;
    this.month = month;
  }

  toString() {
    // Month is in "YYYY-MM" format
    // Return "(month name) YYYY"
    const month = this.month.split("-");
    const year = month[0];
    const monthNumber = parseInt(month[1]);

    const months = [
      "januari", "februari", "maart", "april", "mei", "juni",
      "juli", "augustus", "september", "oktober", "november", "december"
    ];

    return `${months[monthNumber - 1]} ${year}`;
  }

  static fromDB(obj: DB.ScheduleReport) {
    return new ReportMonth(obj.id, obj.month);
  }
};



export class MonthSchedule {
  month: ReportMonth;
  days: Map<string, DaySchedule>;

  constructor(month: ReportMonth, days: DaySchedule[]) {
    this.month = month;
    this.days = new Map<string, DaySchedule>();
    days.forEach(day => {
      this.days.set(day.date.toString(), day);
    });
  }

  addDay(day: DaySchedule) {
    this.days.set(day.date.toString(), day);
  }

  hasDay(date: Datum) {
    return this.days.has(date.toString());
  }

  getDay(date: Datum) {
    return this.days.get(date.toString());
  }
  

  static fromDB(slots: DB.ScheduleMonth[], month: DB.ScheduleReport): MonthSchedule {

    let monthSchedule = new MonthSchedule(ReportMonth.fromDB(month), []);
  
    slots.forEach(db_slot => {
      const slot = ScheduleSlot.fromDB(db_slot);
      const date = new Datum(db_slot.date);

      // Check if day already exists
      if (!monthSchedule.hasDay(date)) {
        monthSchedule.addDay(new DaySchedule(date, []));
      } else
      {
        monthSchedule.getDay(date)?.addSlot(slot);
      }

    });

    return monthSchedule;
  }
}

export class DaySchedule {
  date: Datum;
  slots: Map<string, ScheduleSlot>;

  addSlot(slot: ScheduleSlot) {
    this.slots.set(slot.time.toString(), slot);
  }

  hasSlot(time: DayTime) {
    return this.slots.has(time.toString());
  }

  constructor(date: Datum, slots: ScheduleSlot[]) {
    this.date = date;
    this.slots = new Map<string, ScheduleSlot>();
    slots.forEach(slot => {
      this.slots.set(slot.time.toString(), slot);
    });
  }
}

export class ScheduleSlot {
  id: number;
  time: DayTime;
  offsetMinutes: Time;
  offsetTime: DayTime;
  timeLength: Time;
  teamID: number;

  constructor(id: number, time: DayTime, offsetMinutes: Time, offsetTime: DayTime, timeLength: Time, teamID: number) {
    this.id = id;
    this.time = time;
    this.offsetMinutes = offsetMinutes;
    this.offsetTime = offsetTime;
    this.timeLength = timeLength;
    this.teamID = teamID;
  }

  static fromDB(obj: DB.ScheduleMonth) {
    return new ScheduleSlot(obj.id, DayTime.fromString(obj.time), Time.fromMinutes(obj.offsetMinutes), DayTime.fromString(obj.offsetTime), Time.fromMinutes(obj.timeLength), obj.teamID);
  }

}