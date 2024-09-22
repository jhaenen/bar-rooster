export interface Schedule {
  id: number;
  teamID: number;
  date: string;
  time: string;
  offsetMinutes: number;
}

export interface ScheduleOffset extends Schedule {
  offsetTime: string;
}

export interface ScheduleLenghts extends ScheduleOffset {
  timeLength: number;
}

export interface Team {
  id: number;
  name: string;
  parents: boolean;
}

export interface TeamLengths extends Team {
  totalLength: number;
}