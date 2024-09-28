import { Schedule, type ISlot } from "./Schedule";
import type { DayTime } from "./Time";

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
}

export class GameSchedule extends Schedule<GameSlot>{}