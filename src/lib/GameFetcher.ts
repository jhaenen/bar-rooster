import { Schedule } from './types/Schedule';
import { DayTime } from './types/Time';

export async function fetchMonthSchedule(month: number): Promise<Schedule> {
  // Check if month is valid
  if (month < 1 || month > 12) {
    throw new Error('month must be between 1 and 12');
  }

  const firstOfMonth = new Date(new Date().getFullYear(), month - 1, 1);

  // Check if month is in the future
  if (firstOfMonth < new Date()) {
    throw new Error('month must be in the future');
  }

  const now = new Date();

  // Get the weekOffset for the first day of the month
  const weekOffset = Math.ceil((firstOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));

  // Apply weekOffset on current date
  const weekOffsetCurrentDate = new Date();
  weekOffsetCurrentDate.setDate(weekOffsetCurrentDate.getDate() + 7 * weekOffset);


  // Get the number of days in the month
  const lastOfMonth = new Date(new Date().getFullYear(), month, 0);

  // Calculate the number of days between the weekOffsetCurrentDate and the last day of the month
  const days = Math.floor((lastOfMonth.getTime() - weekOffsetCurrentDate.getTime()) / (1000 * 60 * 60 * 24));

  const url = `https://data.sportlink.com/programma?gebruiklokaleteamgegevens=NEE&weekoffset=${weekOffset}&eigenwedstrijden=JA&thuis=JA&uit=NEE&client_id=${import.meta.env.VITE_API_KEY}&aantaldagen=${days}`;

  const response = await fetch(url);
  const data = await response.json();
  
  let schedule: Schedule = new Schedule();

  for (const game of data) {
    const dateString = game.kaledatum;

    // Date string is in format "YYYY-MM-DD 00:00:00.00"
    const parts = dateString.split(' ')[0].split('-');

    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

    // Check if game date is already in the schedules array
    if (!schedule.hasDay(date)) {
      schedule.addDay(date);
    }

    let day = schedule.getDay(date)!;

    const time = DayTime.fromString(game.aanvangstijd);

    // Check if timeslot exists
    if (!day.hasTimeslot(time)) {
      day.addTimeslot(time);
    }

    day.addTeam(time, game.thuisteam);
  }

  schedule.addLeadAndBackTime();
  schedule.sort();

  return schedule;
}