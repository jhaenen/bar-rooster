<script lang="ts">
  import * as DB from "$lib/db/types";

  export let data: {
    schedule: DB.ScheduleMonth[];
  };

  console.log(data.schedule);
</script>
