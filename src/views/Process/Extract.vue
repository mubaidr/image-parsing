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

export default defineComponent({
  setup() {
    async function extract() {
      const wm = new WorkerManager()
      const data = wm
        .extract(dataPaths.imagesBarcode, dataPaths.designBarcode)
        .then(console.log)

      console.log(await data)
    }

    return { extract }
  },
})
</script>

<style></style>
