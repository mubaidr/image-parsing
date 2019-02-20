<template>
  <div class="section">
    <h1 class="title">Process</h1>
    <h2 class="subtitle is-6">Process scanned images to generate result.</h2>

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
          <span class="file-label">Choose a directory</span>
        </span>
        <span class="file-name">{{ imageDirectory }}</span>
      </label>
    </div>

    <br>

    <button
      :disabled="running || !imageDirectory"
      @click="startProcess"
      class="button is-primary"
    >Start Process</button>

    <button
      :disabled="!running"
      @click="stopProcess"
      class="button is-danger"
    >Stop Process</button>

    <br>
    <br>
    <br>

    <table
      v-show="running"
      class="table is-bordered is-fullwidth"
    >
      <tr>
        <th>Total</th>
        <th>Remaining</th>
        <th>Time remaining</th>
        <th></th>
      </tr>
      <tr>
        <td>{{ totalImages }}</td>
        <td>{{ processedImages }}</td>
        <td>{{ remainingTime }}</td>
        <td>
          <looping-rhombuses-spinner color="#ff1d5e"/>
        </td>
      </tr>
    </table>
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
      if (this.perImageTime === 0) return 'Calculating...'

      const ms = (this.totalImages - this.totalWorkers) * this.perImageTime
      return this.toHHMMSS(ms)
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
    },

    async stopProcess() {
      processingModule.stop()
      this.running = false
    },

    listner(m) {
      if (m.progress) {
        this.processedImages += 1

        this.perImageTime = m.time
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
      const input = ms / 1000

      let hours = Math.floor(input / 3600)
      let minutes = Math.floor((input - hours * 3600) / 60)
      let seconds = input - hours * 3600 - minutes * 60

      if (hours < 10) {
        hours = `0${hours}`
      }
      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      return `${hours}:${minutes}:${seconds}`
    },
  },
}
</script>

<style scoped lang="sass">
.table
  td, th
    text-align: center
</style>
