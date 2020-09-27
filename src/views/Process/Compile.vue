<template>
  <div>
    <h1>Compile</h1>
    <button @click="process">Compile</button>
  </div>
</template>

<script lang="ts">
import { dataPaths } from '@/utilities/dataPaths'
import { defineComponent } from 'vue'
import { WorkerManager } from '@/utilities/workers/WorkerManager'
import { PROGRESS_STATES } from '@/utilities/workers/PROGRESS_STATES'

export default defineComponent({
  setup() {
    async function process() {
      const wm = new WorkerManager()

      const data = await wm
        .on(PROGRESS_STATES.ERROR, (msg) => {
          console.log('ERROR ', msg)
        })
        .compile(dataPaths.result, dataPaths.keyImage, 3, 1)

      console.log(data)
    }

    return { process }
  },
})
</script>

<style></style>
