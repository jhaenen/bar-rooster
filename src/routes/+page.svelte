<script lang="ts">
  import { Schedule } from '$lib/types/Schedule';
  import type { POJOSchedule } from '$lib/types/Schedule';

  export let data: POJOSchedule;

  const schedule: Schedule = Schedule.fromPOJO(data);
</script>

{#each schedule.matchDays as date}
{@const matchDayTeams = date.getTeams()}
  <div>
    <h2>{date.date}</h2>
    <ul>
      {#each date.timeslots as timeslot}
        <li>
          <div>
          <h3>{timeslot.time}</h3>
          <!-- Create select with match day teams -->
          <select>
            <option value="" hidden disabled selected>Selecteer team</option>
          {#each matchDayTeams as matchDayTeam}
          <option value={matchDayTeam.id}>{matchDayTeam.name}</option>
          {/each}
        </select>
      </div>
          <ul>
            {#each timeslot.teams as team}
              <li>
                <h4>{team.name} {(team.parents) ? "(Ouders)" : ""}</h4>  
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>  
{/each}