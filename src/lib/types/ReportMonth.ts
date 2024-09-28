import * as DB from "$lib/db/types";

export class ReportMonth {
  id: number;
  month: string;

  constructor(id: number, month: string) {
    this.id = id;
    this.month = month;
  }

  toString() {
    // Month is in "YYYY-MM" format
    // Return "(month name) YYYY"
    const month = this.month.split("-");
    const year = month[0];
    const monthNumber = parseInt(month[1]);

    const months = [
      "januari", "februari", "maart", "april", "mei", "juni",
      "juli", "augustus", "september", "oktober", "november", "december"
    ];

    return `${months[monthNumber - 1]} ${year}`;
  }

  getYear() {
    return parseInt(this.month.split("-")[0]);
  }

  getMonth() {
    return parseInt(this.month.split("-")[1]);
  }

  static fromDB(obj: DB.ScheduleReport) {
    return new ReportMonth(obj.id, obj.month);
  }

  static fromPOJO(reportMonth: ReportMonth): ReportMonth {
    return new ReportMonth(reportMonth.id, reportMonth.month);
  }
};