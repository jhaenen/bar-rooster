import { gameTime } from "../config";
import { DayTime } from "$lib/types/Time";

import * as AppSchedule from "$lib/types/Schedule";
import { Team } from "$lib/types/Team";

export class Schedule {
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

  addLeadAndBackTime() {
    // Add 30 minutes before and after each day
    this.schedule.forEach((day, _) => {
      // Get first timeslot of the day
      const firstTimeslot = DayTime.fromString(Array.from(day.schedule.keys())[0]);
      const lastTimeslot = DayTime.fromString(Array.from(day.schedule.keys())[Array.from(day.schedule.keys()).length - 1]);

      // Add 30 minutes before and after
      const leadTime = DayTime.fromMinutes(firstTimeslot.asMinutes() - 30);
      const backTime = DayTime.addTime(lastTimeslot, gameTime);

      // Add lead and back time to the schedule
      day.addTimeslot(leadTime);
      day.addTimeslot(backTime);      
    });
  }

  sort() {
    // Sort the schedule by date
    this.schedule = new Map([...this.schedule.entries()].sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA.getTime() - dateB.getTime();
    }));

    // Sort each day
    this.schedule.forEach((day, _) => {
      day.sortDay();
    });
  }

  toAppSchedule(): AppSchedule.Schedule {
    let schedule = new AppSchedule.Schedule(); 

    this.schedule.forEach((day, date) => {
      let matchDay = new AppSchedule.MatchDay(date);

      day.schedule.forEach((teams, time) => {
        let timeSlot: AppSchedule.TimeSlot = {
          time: DayTime.fromString(time),
          teams: teams.map<Team>(team => {
            return new Team(team, false);
          }
          )
        };

        matchDay.timeslots.push(timeSlot);
      });

      schedule.matchDays.push(matchDay);
    });
  
    return schedule;
  }
}

export class DaySchedule {
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

  sortDay() {
    // Sort the schedule by time
    this.schedule = new Map([...this.schedule.entries()].sort((a, b) => {
      const timeA = DayTime.fromString(a[0]);
      const timeB = DayTime.fromString(b[0]);
      return timeA.compare(timeB);
    }));
  }
}