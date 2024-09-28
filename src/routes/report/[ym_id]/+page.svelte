<script lang="ts">
  import * as DB from "$lib/db/types";
  import { ReportSchedule } from "$lib/types/ReportSchedule";
  import { Team } from "$lib/types/Team";
  import { Datum } from "$lib/types/Time";

  export let data: {
    schedule: DB.ScheduleMonth[];
    month: DB.ScheduleReport;
    teams: DB.Team[];
  };

  const schedule: ReportSchedule = ReportSchedule.fromDB(
    data.schedule,
    data.month
  );

  const teamMap = new Map(
    data.teams.map((team) => [team.id, Team.fromDB(team)])
  );
</script>

<h1>Schema van {schedule.month}</h1>
{#each schedule.days as [dateString, day]}
  <h2>{new Datum(dateString).toPrettyString()}</h2>
  <ul>
    {#each day.slots as [timeString, timeslot]}
      {@const team = teamMap.get(timeslot.teamID)}
      <li>
        <div>
          <h3>
            {timeString}
            {#if team}
              - {team.name} {team.parents ? "(Ouders)" : ""}
            {/if}
          </h3>
        </div>
      </li>
    {/each}
  </ul>
{/each}
