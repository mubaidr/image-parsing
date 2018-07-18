<template>
  <div class="section">
    <h1 class="title">Process</h1>
    <h2 class="subtitle">Process scanned images to generate result.</h2>

    <h3 class="subtitle">Choose scanned images directory: </h3>
    <load-files
      file-type="image"/>

    <h3 class="subtitle">Choose design file: </h3>
    <load-files
      :is-file="true"
      file-type="design"/>

    <button
      class="button is-primary"
      @click="startProcess">Start Process</button>

    <button
      class="button is-danger"
      @click="stopProcess">Stop Process</button>

    <progress
      class="progress is-primary"
      value="15"
      max="100">15%</progress>
  </div>
</template>

<script>
import loadFiles from './Templates/LoadFiles.vue'

const processingModule = require('../../utilities/process.js')

export default {
  components: { loadFiles },

  methods: {
    async startProcess() {
      processingModule.start()
    },

    async stopProcess() {
      processingModule.stop()
    },
  },
}
</script>

<style>
</style>
