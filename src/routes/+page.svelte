<script lang="ts">
  import * as DB from "$lib/db/types";
  import { ReportMonth } from "$lib/types/Reports";

  export let data: {
    reports: DB.ScheduleReports[];
  };

  const reports: ReportMonth[] = data.reports.map((report) => {
    return ReportMonth.fromPOJO(report);
  });
</script>

{#each reports as report}
  <div>
    <a href="report/{report.id}">{report}</a>
  </div>
{/each}
