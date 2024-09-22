<script lang="ts">
  import { Schedule } from '$lib/types/Schedule';
  import type { POJOSchedule } from '$lib/types/Schedule';

  export let data: POJOSchedule;

  const schedule: Schedule = Schedule.fromPOJO(data);
</script>

{#each schedule.matchDays as date}
  <div>
    <h2>{date.date}</h2>
    <ul>
      {#each date.timeslots as timeslot}
        <li>
          <h3>{timeslot.time}</h3>
          <ul>
            {#each timeslot.teams as team}
              <li>
                <h4>{team}</h4>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>  
{/each}