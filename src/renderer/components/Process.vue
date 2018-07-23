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
    <transition name="slide-up">
      <div
        v-show="running">
        <div>
          Processing: <strong>{{ processedImages }}/{{ totalImages }}</strong>, ETA: <strong>{{ (totalImages - processedImages) * 0.5 }}</strong>s
        </div>
        <progress
          :value="progress"
          class="progress is-primary is-large"
          max="100">{ progress }%</progress>
      </div>
    </transition>
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
      processedWorkers: 0,
      totalWorkers: 0,
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
      }
    },

    running() {
      this.processedImages = 0
      this.totalImages = 0
    },
  },

  methods: {
    async startProcess() {
      this.running = true
      const { totalImages, totalWorkers } = await processingModule.start(
        this.listner,
      )

      this.totalImages = totalImages
      this.totalWorkers = totalWorkers
    },

    async stopProcess() {
      this.running = false
      processingModule.stop()
    },

    listner(m) {
      if (m.progress) {
        this.processedImages += 1
        // console.log('progress: ', m.progress)
      } else if (m.completed) {
        this.processedWorkers += 1
      } else if (m.result) {
        console.log('result: ', m)
      } else if (m.log) {
        console.log('log: ', m.log)
      } else if (m.error) {
        console.log('error: ', m.error)
      }
    },

    resultExtracted() {},
  },
}
</script>

<style>
</style>
