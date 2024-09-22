import { Time } from "./Time";

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
}

export interface POJOTeam {
  name: string;
  parents: boolean;
  allocatedTime: string;
}