<template>
  <div class="section">
    <h1 class="title">Process</h1>
    <h2 class="subtitle is-6">Process scanned images to generate result.</h2>

    <br>

    <div
      class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          type="file"
          name="resume"
          @click="chooseDirectory"/>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-folder"/>
          </span>
          <span class="file-label">
            Choose a directory
          </span>
        </span>
        <span
          class="file-name">
          {{ imageDirectory }}
        </span>
      </label>
    </div>

    <br>
    <br>

    <button
      :disabled="running || !imageDirectory"
      class="button is-dark"
      @click="startProcess">Start Process</button>

    <button
      :disabled="!running"
      class="button is-danger"
      @click="stopProcess">Stop Process</button>

    <div
      :class="{'is-active': running}"
      class="modal">
      <div class="modal-background"/>
      <div class="modal-content">
        <div
          class="box">
          <h3 class="title is-5">Processing</h3>
          <div>
            Processing image <strong>{{ processedImages }} of {{ totalImages }}</strong>, Estimated time remaining: <strong>{{ remainingTime }}</strong>
          </div>
          <progress
            :value="progress"
            class="progress is-primary is-large"
            max="100">{ progress }%</progress>
        </div>
      </div>
    </div>

    <!-- TODO: add a wizard view/template for verification input-->
  </div>
</template>

<script>
// eslint-disable-next-line
const { remote } = require('electron')
const processingModule = require('../../utilities/process.js')

export default {
  data() {
    return {
      imageDirectory:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\images',
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

    remainingTime() {
      const t = (this.totalImages - this.processedImages) * 0.5
      return t ? `${t}s` : 'Calculating...'
    },
  },

  watch: {
    running(val) {
      if (val) return

      this.processedImages = 0
      this.totalImages = 0
    },
  },

  methods: {
    async startProcess() {
      this.running = true

      const { totalImages } = await processingModule.start(
        this.listner,
        undefined,
        this.imageDirectory,
        true,
      )
      this.totalImages = totalImages
    },

    async stopProcess() {
      processingModule.stop()
      this.running = false
    },

    listner(m) {
      if (m.progress) {
        this.processedImages += 1
      } else if (m.completed || m.verification) {
        this.running = false
      } else if (m.log) {
        console.log('log: ', m.log)
      } else if (m.error) {
        console.log('error: ', m.error)
      }

      // TODO: activate wizard to verify inputs
      if (m.verification) {
        console.log('recieved verify data: ', m.verifyData)
      }
    },

    chooseDirectory() {
      ;[this.imageDirectory] = remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      }) || [false]
    },
  },
}
</script>

<style>
</style>
