<template>
  <div>
    <h1>Extract</h1>
    <button @click="process">Extract</button>
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
          console.error('ERROR ', msg)
        })
        .extract(DataPaths.imagesBarcode, DataPaths.designBarcode)

      console.log(data)
      wm.stop()
    }

    return { process }
  },
})
</script>

<style></style>
