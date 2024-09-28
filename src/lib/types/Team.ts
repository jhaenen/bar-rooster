import { Time } from "./Time";
import * as DB from "$lib/db/types";

export class Team {
  id: number;
  name: string;
  parents: boolean;
  allocatedTime: Time;

  private static idCounter = 0;

  constructor(name: string, parents: boolean) {
    this.id = Team.idCounter++;
    this.name = name;
    this.parents = parents;
    this.allocatedTime = new Time(0, 0);
  }

  static fromPOJO(pojoTeam: POJOTeam): Team {
    let team = new Team(pojoTeam.name, pojoTeam.parents);
    team.allocatedTime = Time.fromString(pojoTeam.allocatedTime);

    return team;
  }

  toPOJO(): POJOTeam {
    return {
      name: this.name,
      parents: this.parents,
      allocatedTime: this.allocatedTime.toString()
    };
  }
  
  static fromDB(dbTeam: DB.Team | DB.TeamLengths): Team {
    let team = new Team(dbTeam.name, dbTeam.parents);
    team.id = dbTeam.id;

    // If dbTeam is a TeamLengths object, set the allocated time
    if ('totalLength' in dbTeam) {
      team.allocatedTime = Time.fromMinutes(dbTeam.totalLength);
    }

    return team;
  }
}

export interface POJOTeam {
  name: string;
  parents: boolean;
  allocatedTime: string;
}