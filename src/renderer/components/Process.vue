<template>
  <div class="section">
    <h1 class="title">Process</h1>
    <h2 class="subtitle">Process scanned images to generate result.</h2>

    <button
      class="button is-primary"
      @click="startProcess">Start Process</button>

    <button
      class="button is-danger"
      @click="stopProcess">Stop Process</button>
  </div>
</template>

<script>
import loadFiles from './Templates/LoadFiles.vue'

const processingModule = require('../../utilities/process.js')

export default {
  components: { loadFiles },

  methods: {
    async startProcess() {
      processingModule.process()
    },

    async stopProcess() {
      processingModule.stop()
    },
  },
}
</script>

<style>
</style>
