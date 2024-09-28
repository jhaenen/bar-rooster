import * as DB from "$lib/db/types";

export async function load({ locals, params }) {

  const loadMonth = new Promise<DB.ScheduleReport>((resolve, reject) => {
      
      const db = locals.db;
  
      const monthQuery = "SELECT * FROM scheduleReports WHERE id = ?";
  
      db.get<DB.ScheduleReport>(monthQuery, params.ym_id, (err, row) => {
        if (err) {
          reject(new Error(err?.message));
        } else {
          resolve(row);
        }
      });
    });

  const month = await loadMonth;

  const loadScheduleMonth = new Promise<DB.ScheduleMonth[]>((resolve, reject) => {

    const db = locals.db;

    const loadScheduleMonthQuery = "SELECT * FROM scheduleMonth WHERE month = ?";

    db.all<DB.ScheduleMonth>(loadScheduleMonthQuery, month.month, (err, rows) => {
      if (err) {
        reject(new Error(err?.message));
      } else {
        resolve(rows);
      }
    });
  });

  const loadTeams = new Promise<DB.Team[]>((resolve, reject) => {
      
      const db = locals.db;
  
      const teamsQuery = "SELECT * FROM teams";
  
      db.all<DB.Team>(teamsQuery, (err, rows) => {
        if (err) {
          reject(new Error(err?.message));
        } else {
          resolve(rows);
        }
      });
    });

  const teams = await loadTeams;

  const scheduleMonth = await loadScheduleMonth;
  
  return {schedule: scheduleMonth, month: month, teams: teams};
}