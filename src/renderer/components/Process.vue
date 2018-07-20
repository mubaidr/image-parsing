<template>
  <div class="section">
    <h1 class="title">Process</h1>
    <h2 class="subtitle">Process scanned images to generate result.</h2>

    <h3 class="subtitle">Choose scanned images directory: </h3>
    <load-files
      file-type="image"/>

    <h3 class="subtitle">Choose answer key file: </h3>
    <load-files
      :is-file="true"
      file-type="image"/>

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
      :value="progress"
      class="progress is-primary is-large"
      max="100">{ progress }%</progress>
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
      processedImages: 0,
      totalImages: 0,
    }
  },

  computed: {
    progress() {
      if (this.totalImages > 0) {
        return Math.ceil(this.processedImages / this.totalImages * 100)
      }
      return 0
    },
  },

  watch: {
    progress(val) {
      if (val === 100) {
        this.running = false
        this.processedImages = 0
        this.totalImages = 0
      }
    },
  },

  methods: {
    async startProcess() {
      this.running = true
      const { totalImages } = await processingModule.start(this.listner)

      this.totalImages = totalImages
    },

    async stopProcess() {
      this.running = false
      processingModule.stop()
    },

    listner(msg) {
      if (msg.progress) {
        this.processedImages += 1
        // console.log('progress: ', msg.progress)
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
