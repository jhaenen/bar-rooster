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
}

export class ReportSchedule extends Schedule<ReportSlot> {
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
}