<script lang="ts">
  import { GameSchedule } from "$lib/types/GameSchedule";
  import { Team, teamIDsToTeams } from "$lib/types/Team";

  export let data;

  const schedule = GameSchedule.fromPOJO(data.schedule);
  const teams = data.teams.map((team) => Team.fromPOJO(team));
</script>

<h1>Schema van {schedule.month}</h1>
{#each schedule.days as [_, day]}
  {@const dayTeams = teamIDsToTeams(day.getTeamIDs(), teams)}
  <div>
    <h2>{day.date}</h2>
    <ul>
      {#each day.slots as [_, gameSlot]}
        <li>
          <div>
            <h3>{gameSlot.time}</h3>
            <select>
              <option value="" hidden disabled selected>Selecteer team</option>
              {#each dayTeams as dayTeam}
                {#if dayTeam}
                  <option value={dayTeam.id}>
                    {dayTeam.name}
                    {dayTeam.parents ? "(Ouders)" : ""}
                  </option>
                {/if}
              {/each}
            </select>
          </div>
          <ul>
            {#each gameSlot.teamIDs as teamID}
              {@const team = teams.find((team) => team.id === teamID)}
              {#if team}
                <li>
                  <h4>{team.name} {team.parents ? "(Ouders)" : ""}</h4>
                </li>
              {/if}
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
{/each}
