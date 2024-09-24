import * as DB from "$lib/db/types";

export async function load({ locals, params }) {

  const loadMonth = new Promise<DB.ScheduleReports>((resolve, reject) => {
      
      const db = locals.db;
  
      const monthQuery = "SELECT * FROM scheduleReports WHERE id = ?";
  
      db.get<DB.ScheduleReports>(monthQuery, params.ym_id, (err, row) => {
        if (err) {
          reject(new Error(err?.message));
        } else {
          resolve(row);
        }
      });
    });

  const month = await loadMonth;

  console.log(month);

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

  const scheduleMonth = await loadScheduleMonth;

  console.log(scheduleMonth);
  
  return {schedule: scheduleMonth};
}