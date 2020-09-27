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
    const wm = new WorkerManager()

    async function extract() {
      const data = await wm.extract(
        dataPaths.imagesBarcode,
        dataPaths.designBarcode
      )

      console.log(data)
    }

    return { extract }
  },
})
</script>

<style></style>
