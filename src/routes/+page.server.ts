import * as DB from "$lib/db/types";

export async function load({ locals }) {
  const loadScheduleReports = new Promise<DB.ScheduleReports[]>((resolve, reject) => {

    const db = locals.db;

    const scheduleReportsQuery = "SELECT * FROM scheduleReports";

    db.all<DB.ScheduleReports>(scheduleReportsQuery, (err, rows) => {
      if (err) {
        reject(new Error(err?.message));
      } else {
        resolve(rows);
      }
    });
  });

  const scheduleReports = await loadScheduleReports;

  console.log(scheduleReports);
  
  return {
    reports: scheduleReports
  };
}