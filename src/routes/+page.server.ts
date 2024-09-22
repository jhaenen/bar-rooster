import { fetchMonthSchedule } from "$lib/GameFetcher/GameFetcher";
import { Schedule } from "$lib/types/Schedule";

import * as DB from "$lib/db/types";

export async function load({ locals }) {
  const schedule: Schedule = await fetchMonthSchedule(10);

  const loadScheduleLengths = new Promise<DB.ScheduleLenghts[]>((resolve, reject) => {

    const db = locals.db;

    const scheduleLengthsQuery = "SELECT * FROM scheduleLengths";

    db.all<DB.ScheduleLenghts>(scheduleLengthsQuery, (err, rows) => {
      if (err) {
        reject(new Error(err?.message));
      } else {
        resolve(rows);
      }
    });
  });

  const scheduleLengths = await loadScheduleLengths;

  console.log(scheduleLengths);
  
  return schedule.toPOJO();
}