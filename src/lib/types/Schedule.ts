import { Team, type POJOTeam } from "./Team";
import { Time } from "./Time";

export class Schedule {
  matchDays: MatchDay[];

  constructor() {
    this.matchDays = [];
  }

  toPOJO(): POJOSchedule {
    let pojoSchedule: POJOSchedule = {
      matchDays: []
    };

    this.matchDays.forEach(matchDay => {
      let pojoMatchDay: POJOMatchDay = {
        date: matchDay.date,
        timeslots: []
      };

      matchDay.timeslots.forEach(timeSlot => {
        let pojoTimeSlot: POJOTimeSlot = {
          time: timeSlot.time.toString(),
          teams: timeSlot.teams.map(team => team.toPOJO())
        };

        pojoMatchDay.timeslots.push(pojoTimeSlot);
      });

      pojoSchedule.matchDays.push(pojoMatchDay);
    });

    return pojoSchedule;
  }

  static fromPOJO(pojoSchedule: POJOSchedule): Schedule {
    let schedule: Schedule = new Schedule();

    pojoSchedule.matchDays.forEach(pojoMatchDay => {
      let matchDay = new MatchDay(pojoMatchDay.date);

      pojoMatchDay.timeslots.forEach(pojoTimeSlot => {
        let timeSlot = new TimeSlot(Time.fromString(pojoTimeSlot.time));
        timeSlot.teams = pojoTimeSlot.teams.map(pojoTeam => Team.fromPOJO(pojoTeam));

        matchDay.timeslots.push(timeSlot);
      });

      schedule.matchDays.push(matchDay);
    });

    return schedule;
  }
}

export class MatchDay {
  date: string;
  timeslots: TimeSlot[];

  constructor(date: string) {
    this.date = date;
    this.timeslots = [];
  }

  getTeams(): Team[] {
    let teams: Team[] = [];

    this.timeslots.forEach(timeSlot => {
      timeSlot.teams.forEach(team => {
        teams.push(team);
      });
    });

    return teams;
  }
}

export class TimeSlot {
  time: Time;
  teams: Team[];

  constructor(time: Time) {
    this.time = time;
    this.teams = [];
  }
}

export interface POJOSchedule {
  matchDays: POJOMatchDay[];
}

export interface POJOMatchDay {
  date: string;
  timeslots: POJOTimeSlot[];
}

export interface POJOTimeSlot {
  time: string;
  teams: POJOTeam[];
}