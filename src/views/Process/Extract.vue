<template>
  <div>
    <h1>Extract</h1>
    <button @click="extract">Extract</button>
  </div>
</template>

<script lang="ts">
import { dataPaths } from '@/utilities/dataPaths'
import { defineComponent } from 'vue'
import { WorkerManager } from '@/utilities/workers/WorkerManager'
import { PROGRESS_STATES } from '@/utilities/workers/PROGRESS_STATES'

export default defineComponent({
  setup() {
    async function extract() {
      const wm = new WorkerManager()

      const data = await wm
        .on(PROGRESS_STATES.ERROR, (msg) => {
          console.log('ERROR ', msg)
        })
        .extract(dataPaths.imagesBarcode, dataPaths.designBarcode)

      console.log(data)
    }

    return { extract }
  },
})
</script>

<style></style>
