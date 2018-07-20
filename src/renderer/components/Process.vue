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
      :disabled="running"
      class="button is-primary"
      @click="startProcess">Start Process</button>

    <button
      :disabled="!running"
      class="button is-danger"
      @click="stopProcess">Stop Process</button>

    <br>
    <br>
    <progress
      v-show="running"
      class="progress is-warning">0%</progress>
  </div>
</template>

<script>
import loadFiles from './Templates/LoadFiles.vue'

const processingModule = require('../../utilities/process.js')

export default {
  components: { loadFiles },

  data() {
    return {
      running: false,
    }
  },

  methods: {
    async startProcess() {
      this.running = true
      processingModule.start(this.listner)
    },

    async stopProcess() {
      this.running = false
      processingModule.stop()
    },

    listner(msg) {
      if (msg.progress) {
        console.log('progress: ', msg.progress)
      } else if (msg.completed) {
        console.log('completed: ', msg.completed)
      } else if (msg.log) {
        console.log('log: ', msg.log)
      } else if (msg.error) {
        console.log('error: ', msg.error)
      }
    },
  },
}
</script>

<style>
</style>
