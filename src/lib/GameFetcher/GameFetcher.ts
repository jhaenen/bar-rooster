import { Datum, DayTime } from '$lib/types/Time';
import type { Team } from '$lib/types/Team';

import { DaySchedule } from '$lib/types/Schedule';
import { GameSchedule, GameSlot } from '$lib/types/GameSchedule';

import * as NBBSchedule from "$lib/GameFetcher/types/NBBSchedule";
import { gameTime } from './config';


export async function fetchMonthSchedule(month: number, teams: Team[]): Promise<GameSchedule> {
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
  const games = await response.json() as NBBSchedule.Wedstrijd[];
  
  let schedule: GameSchedule = new GameSchedule(month);


  for (const game of games) {
    const date: Datum = new Datum(game.datum);

    // Check if game date is already in the schedules array
    if (!schedule.hasDay(date)) {
      let day = new DaySchedule<GameSlot>(date);
      schedule.addDay(day);
    }

    let day = schedule.getDay(date)!;

    const time = DayTime.fromString(game.aanvangstijd);

    // Check if timeslot exists
    if (!day.hasSlot(time)) {
      let slot = new GameSlot(time);
      day.addSlot(slot);
    }

    let slot = day.getSlot(time)!;

    // Get the team id from the team name
    const team = teams.find(team => team.name === game.thuisteam);
    if (team === undefined) {
      throw new Error(`team ${game.thuisteam} not found`);
    }

    slot.addTeamID(team.id);
  }

  addLeadAndBackTime(schedule);
  schedule.sort();

  return schedule;
}

function addLeadAndBackTime(schedule: GameSchedule): GameSchedule {
  // Add 30 minutes before and after each day
  schedule.days.forEach((day, _) => {
    day.sort();

    // Get first and last timeslots of the day
    const firstTimeslot = DayTime.fromString(Array.from(day.slots.keys())[0]);
    const lastTimeslot = DayTime.fromString(Array.from(day.slots.keys())[Array.from(day.slots.keys()).length - 1]);

    // Add 30 minutes before and after
    const leadTime = DayTime.fromMinutes(firstTimeslot.asMinutes() - 30);
    const backTime = DayTime.addTime(lastTimeslot, gameTime);

    // Create empty game slots for lead and back time
    day.addSlot(new GameSlot(leadTime));
    day.addSlot(new GameSlot(backTime));   
  });

  return schedule;
}