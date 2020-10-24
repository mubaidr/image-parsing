<template>
  <div>
    <h1>Compile</h1>
    <button @click="process">Compile</button>
  </div>
</template>

<script lang="ts">
import { DataPaths } from '@/utilities/dataPaths'
import { defineComponent } from 'vue'
import { WorkerManager } from '@/utilities/workers/WorkerManager'
import { ProgressStates } from '@/utilities/workers/ProgressStates'

export default defineComponent({
  setup() {
    async function process() {
      const wm = new WorkerManager()

      const data = await wm
        .on(ProgressStates.Error, (msg) => {
          console.log('ERROR ', msg)
        })
        .compile(DataPaths.result, DataPaths.keyImage, 3, 1)

      console.log(data)
    }

    return { process }
  },
})
</script>

<style></style>
