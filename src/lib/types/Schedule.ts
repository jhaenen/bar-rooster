import type { Datum, DayTime } from "./Time";

export interface ISlot {
  time: DayTime;
}
export class Schedule<Slot extends ISlot> {
  month: number;
  days: Map<string, DaySchedule<Slot>>;

  constructor(month: number) {
    this.month = month;
    this.days = new Map<string, DaySchedule<Slot>>();
  }

  addDay(day: DaySchedule<Slot>) {
    this.days.set(day.date.toString(), day);
  }

  hasDay(date: Datum) {
    return this.days.has(date.toString());
  }

  getDay(date: Datum) {
    return this.days.get(date.toString());
  }

  sort() {
    this.days = new Map([...this.days.entries()].sort((a, b) => {
      return a[0] < b[0] ? -1 : 1;
    }));

    this.days.forEach(day => {
      day.sort();
    });
  }
}

export class DaySchedule<Slot extends ISlot> {
  date: Datum;
  slots: Map<string, Slot>;

  addSlot(slot: Slot) {
    this.slots.set(slot.time.toString(), slot);
  }

  hasSlot(time: DayTime) {
    return this.slots.has(time.toString());
  }

  getSlot(time: DayTime): Slot | undefined {
    return this.slots.get(time.toString());
  }

  constructor(date: Datum) {
    this.date = date;
    this.slots = new Map<string, Slot>();
  }

  sort() {
    this.slots = new Map([...this.slots.entries()].sort((a, b) => {
      return a[0] < b[0] ? -1 : 1;
    }));
  }
}

