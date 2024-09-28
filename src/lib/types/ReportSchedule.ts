import { ReportMonth } from "./ReportMonth";
import { DaySchedule, Schedule, type ISlot } from "./Schedule";
import type * as DB from "../db/types";
import { Datum, DayTime } from "./Time";

export class ReportSlot implements ISlot {
  teamID: number;
  time: DayTime;

  constructor(teamID: number, time: DayTime) {
    this.teamID = teamID;
    this.time = time;
  }

  static fromDB(dbSlot: DB.ScheduleMonth): ReportSlot {
    return new ReportSlot(dbSlot.teamID, DayTime.fromString(dbSlot.time));
  }

  static fromPOJO(slot: ReportSlot): ReportSlot {
    return new ReportSlot(slot.teamID, DayTime.fromPOJO(slot.time));
  }
}

export class ReportSchedule extends Schedule<ReportDay> {
  reportMonth: ReportMonth;

  constructor(reportMonth: ReportMonth) {
    super(reportMonth.getMonth());
    this.reportMonth = reportMonth;
  }

  static fromDB(slots: DB.ScheduleMonth[], month: DB.ScheduleReport): ReportSchedule {

    let monthSchedule = new ReportSchedule(ReportMonth.fromDB(month));
  
    slots.forEach(db_slot => {
      const slot = ReportSlot.fromDB(db_slot);
      const date = new Datum(db_slot.date);

      // Check if day already exists
      if (!monthSchedule.hasDay(date)) {
        monthSchedule.addDay(new DaySchedule(date));
      } else
      {
        monthSchedule.getDay(date)?.addSlot(slot);
      }

    });

    return monthSchedule;
  }

  static fromPOJO(pojoSchedule: ReportSchedule): ReportSchedule {
    let schedule = new ReportSchedule(ReportMonth.fromPOJO(pojoSchedule.reportMonth));

    for (let [_, day] of pojoSchedule.days) {
      schedule.addDay(ReportDay.fromPOJO(day));
    }

    return schedule;
  }
}

export class ReportDay extends DaySchedule<ReportSlot> {
  static fromPOJO(pojoDay: ReportDay): ReportDay {
    let day = new ReportDay(Datum.fromPOJO(pojoDay.date));

    for (let [_, slot] of pojoDay.slots) {
      day.addSlot(ReportSlot.fromPOJO(slot));
    }

    return day;
  }
}