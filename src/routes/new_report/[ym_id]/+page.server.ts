import * as DB from "$lib/db/types";
import { fetchMonthSchedule } from "$lib/GameFetcher/GameFetcher.js";
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

  // YM_ID is YYMM
  const month: number = parseInt(ym_id.slice(2));
  
  const schedule = await fetchMonthSchedule(month);

  console.log(schedule);

}