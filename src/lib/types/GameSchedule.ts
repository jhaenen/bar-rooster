import { DaySchedule, Schedule, type ISlot } from "./Schedule";
import { Datum, DayTime } from "./Time";

export class GameSlot implements ISlot {
  teamIDs: number[];
  time: DayTime;

  constructor(time: DayTime) {
    this.teamIDs = [];
    this.time = time;
  }

  addTeamID(teamID: number) {
    this.teamIDs.push(teamID);
  }

  static fromPOJO(slot: GameSlot): GameSlot {
    let newSlot = new GameSlot(DayTime.fromPOJO(slot.time));
    newSlot.teamIDs = slot.teamIDs;

    return newSlot;
  }
}

export class GameSchedule extends Schedule<GameDay>{

  static fromPOJO(pojoSchedule: GameSchedule): GameSchedule {
    let schedule = new GameSchedule(pojoSchedule.month);

    for (let [_, day] of pojoSchedule.days) {
      schedule.addDay(GameDay.fromPOJO(day));
    }

    return schedule;
  }
}

export class GameDay extends DaySchedule<GameSlot> {
  static fromPOJO(pojoDay: GameDay): GameDay {
    let day = new GameDay(Datum.fromPOJO(pojoDay.date));

    for (let [_, slot] of pojoDay.slots) {
      day.addSlot(GameSlot.fromPOJO(slot));
    }

    return day;
  }

  getTeamIDs(): number[] {
    let teamIDs: number[] = [];

    for (let [_, slot] of this.slots) {
      teamIDs = teamIDs.concat(slot.teamIDs);
    }

    return teamIDs;
  }
}