import * as DB from "$lib/db/types";
import { fetchMonthSchedule } from "$lib/GameFetcher/GameFetcher.js";
import { Team } from "$lib/types/Team";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, params }) {
  const ym_id = params.ym_id;

  const loadReport = new Promise<DB.ScheduleReport>((resolve, reject) => {
    const db = locals.db;

    const monthQuery = "SELECT * FROM scheduleReports WHERE id = ?";

    db.get<DB.ScheduleReport>(monthQuery, ym_id, (err, row) => {
      if (err) {
        reject(new Error(err?.message));
      } else {
        resolve(row);
      }
    });
  });

  const report = await loadReport;

  if (report) {
    // Reroute to the report page
    redirect(308, `/report/${ym_id}`);
  }

  const loadTeams = new Promise<DB.TeamLengths[]>((resolve, reject) => {
    const db = locals.db;

    const teamsQuery = "SELECT * FROM teamLengths";

    db.all<DB.TeamLengths>(teamsQuery, (err, rows) => {
      if (err) {
        reject(new Error(err?.message));
      } else {
        resolve(rows);
      }
    });
  });

  const db_teams = await loadTeams;

  const teams: Team[] = db_teams.map((team) => Team.fromDB(team));

  // YM_ID is YYMM
  const month: number = parseInt(ym_id.slice(2));
  
  const schedule = await fetchMonthSchedule(month, teams);

  
  return { schedule: structuredClone(schedule), teams: structuredClone(teams) };
}