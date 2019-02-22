<template>
  <div class="section">
    <h1 class="title is-4">Process</h1>
    <h2 class="subtitle is-6">Process scanned images to generate result.</h2>

    <div class="columns">
      <div class="column is-10">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              @click="chooseDirectory"
              class="file-input"
              name="resume"
            />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-folder"/>
              </span>
              <span class="file-label">Choose directory</span>
            </span>
            <span class="file-name">{{ imageDirectory }}</span>
          </label>
        </div>
      </div>
      <div class="column is-2">
        <button
          :disabled="!imageDirectory"
          @click="startProcess"
          v-show="!running"
          class="button is-primary is-fullwidth"
        >
          <span class="icon">
            <i class="fa fa-play"/>
          </span>
          <span>Start</span>
        </button>

        <button
          :disabled="!running"
          @click="stopProcess"
          v-show="running"
          class="button is-warning is-fullwidth"
        >
          <span class="icon">
            <i class="fa fa-stop"/>
          </span>
          <span>Stop</span>
        </button>
      </div>
    </div>

    <!-- TODO: show toast with progress and estimated time remaining -->
  </div>
</template>

<script>
// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote
const processingModule = require('../../utilities/process.js')

export default {
  data() {
    return {
      imageDirectory:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\images',
      running: false,
      processedImages: 0,
      totalImages: 0,
      totalWorkers: 0,
      perImageTime: 0,
      startTime: 0,
      endTime: 0,
    }
  },

  computed: {
    remainingTime() {
      if (this.perImageTime === 0) return 'Calculating'

      const ms =
        500 +
        ((this.totalImages - this.processedImages) * this.perImageTime) /
          this.totalWorkers

      return this.toHHMMSS(Math.round(ms / 500) * 500)
    },
  },

  watch: {
    running(val) {
      if (val) return

      this.processedImages = 0
      this.totalImages = 0
      this.totalWorkers = 0
      this.perImageTime = 0
    },
  },

  methods: {
    async startProcess() {
      this.running = true

      const { totalImages, totalWorkers } = await processingModule.start(
        this.listner,
        this.imageDirectory
      )
      this.totalImages = totalImages
      this.totalWorkers = totalWorkers

      this.$toasted.show('processing...', {
        icon: 'check',
      })
    },

    async stopProcess() {
      processingModule.stop()
      this.running = false
    },

    listner(m) {
      if (m.progress) {
        this.processedImages += 1

        if (!this.perImageTime) this.perImageTime = m.time
      } else if (m.completed || m.verification) {
        this.running = false
      } else if (m.log) {
        console.log('log: ', m.log)
      } else if (m.error) {
        dialog.showErrorBox('Error', m.error)
      }
    },

    chooseDirectory() {
      this.imageDirectory = dialog.showOpenDialog(getCurrentWindow(), {
        properties: ['openDirectory'],
      })[0]
    },

    toHHMMSS(ms) {
      let str = ''
      const input = ms / 1000

      const hours = Math.floor(input / 3600)
      const minutes = Math.floor((input - hours * 3600) / 60)
      const seconds = input - hours * 3600 - minutes * 60

      if (hours) {
        str += `${hours} hours `
      }

      if (minutes) {
        str += `${minutes} minutes `
      }

      if (seconds) {
        str += `${seconds} seconds `
      }

      return str
    },
  },
}
</script>

<style scoped lang="sass">
.table
  td, th
    text-align: center
</style>
