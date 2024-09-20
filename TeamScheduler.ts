class Timeslot {
    constructor(public time: DayTime, public teams: Team[]) {
    }
}

class DayTime {
    constructor(public hour: number, public minute: number) {
      if (hour < 0 || hour > 23) {
        throw new Error('hour must be between 0 and 23');
      }
      if (minute < 0 || minute > 59) {
        throw new Error('minute must be between 0 and 59');
      }
    }
}

class Time {
    constructor(public hour: number, public minute: number) {
    }
}

class Team {
    constructor(public name: string, public scheduledTime: Time, public readonly parents: boolean) {
    }
}

import { BinaryHeap } from "@std/data-structures";

function scheduledDay(timeSlots: BinaryHeap<Timeslot>) {}