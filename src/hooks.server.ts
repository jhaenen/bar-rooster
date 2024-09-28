import type { Handle } from "@sveltejs/kit";
import sqlite3 from "sqlite3";

export const handle : Handle = async ({ event, resolve }) => {
  console.log("hook.server.ts: Hook called");

  if (!event.locals.db) {
    const db = new sqlite3.Database("bar-rooster.db");

    event.locals.db = db;


    const teams_query = "CREATE TABLE IF NOT EXISTS teams (`id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, `name` TEXT, `parents` INTEGER DEFAULT 1)"
      db.run(teams_query, (err) => {
        if(err) {
          throw err
        }
      })

    const schedule_query = "CREATE TABLE IF NOT EXISTS schedule (`id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, `teamID` INTEGER REFERENCES `teams`(`id`), `date` TEXT, `time` TEXT, `offsetMinutes` INTEGER DEFAULT 0)"
    db.run(schedule_query, (err) => {
        if(err) {
          throw err
        }
      })

    const scheduleOffset_view_query = `
    CREATE VIEW IF NOT EXISTS scheduleOffset AS
      SELECT *,

      -- Create column offsetTime that is the sum of column time and offsetMinutes
      -- Time is in "HH:MM" format, offsetMinutes is in minutes
      -- offsetTime is in "HH:MM" format
      substr(time(strftime('%s', time) + offsetMinutes * 60, 'unixepoch'), 1, 5) AS offsetTime

      FROM schedule`;
    
    db.run(scheduleOffset_view_query, (err) => {
      if(err) {
        throw err
      }
    })

    const scheduleLength_view_query = `
    CREATE VIEW IF NOT EXISTS scheduleLengths AS
    SELECT id, teamID, date, time, offsetMinutes, offsetTime, 
    -- Calculate the difference in minutes between the current time and the next time
    CASE
      WHEN next_time IS NULL THEN 30
      ELSE (strftime('%s', next_time) - strftime('%s', time)) / 60
    END AS timeLength
    FROM
    -- Table that adds the next time  
    (SELECT *, 
      LEAD(offsetTime, 1) OVER (PARTITION BY date ORDER BY date, offsetTime) AS next_time
      
    FROM scheduleOffset ORDER BY date, time)`;

    db.run(scheduleLength_view_query, (err) => {
      if(err) {
        throw err
      }
    })

    const scheduleMonth_view_query = `
    CREATE VIEW IF NOT EXISTS scheduleMonth AS
    SELECT *,
    -- Create a column from date that converts the date "YYYY-M?M-DD" to "YYYY-MM"
    strftime('%Y-%m', date) AS month
    FROM scheduleLengths`;

    db.run(scheduleMonth_view_query, (err) => {
      if(err) {
        throw err
      }
    })

    const scheduleReports_view_query = `
    CREATE VIEW IF NOT EXISTS scheduleReports AS
    SELECT  
        CAST(SUBSTR(month, 3, 2) || SUBSTR(month, 6, 2) AS INTEGER) AS id,
        month
    FROM 
    (SELECT month FROM scheduleMonth GROUP BY month)`;

    db.run(scheduleReports_view_query, (err) => {
      if(err) {
        throw err
      }
    })

    const teamLength_view_query = `
    CREATE VIEW IF NOT EXISTS teamLengths AS
    SELECT teams.id, teams.name, teams.parents, 
    CASE WHEN sum(timeLength) IS NULL THEN 0 ELSE sum(timeLength) END as totalLength
    FROM teams
    LEFT JOIN scheduleLengths ON teams.id = scheduleLengths.teamID
    GROUP BY teams.id`;

    db.run(teamLength_view_query, (err) => {
      if(err) {
        throw err
      }
    })

  }

  const resp = await resolve(event);
  return resp;
};