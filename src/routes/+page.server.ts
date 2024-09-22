import { fetchMonthSchedule } from "$lib/GameFetcher/GameFetcher";
import { Schedule } from "$lib/types/Schedule";

export async function load() {
  const schedule: Schedule = await fetchMonthSchedule(10);

  return schedule.toPOJO();
  
}