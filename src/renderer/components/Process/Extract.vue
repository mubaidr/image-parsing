<template>
  <div>
    <h1 class="title is-5">Process</h1>
    <h2 class="subtitle is-6">Process scanned images to generate result.</h2>
    <div class="field">
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="running"
            @click="chooseImageDirectory"
            class="file-input"
            name="resume"
          />
          <span class="file-cta">
            <i class="material-icons">folder_open</i>
            <span class="file-label">Choose directory</span>
          </span>
          <span class="file-name">{{ imageDirectory }}</span>
        </label>
      </div>
      <p class="help">Choose the directory which contains scanned answer sheets.</p>
    </div>

    <br>

    <div class="buttons">
      <button
        :disabled="running || !inputIsValid"
        @click="toggleProcess"
        class="button is-primary"
      >
        <i class="material-icons">flash_on</i>
        <span>Process</span>
      </button>

      <button
        :disabled="!running"
        @click="toggleProcess"
        class="button is-danger"
      >
        <i class="material-icons">stop</i>
        <span>Stop</span>
      </button>
    </div>

    <br>
    <br>
    <br>

    <Transition
      mode="out-in"
      name="slide-down"
    >
      <table
        v-if="running"
        class="table is-fullwidth"
      >
        <thead>
          <tr>
            <th></th>
            <th>Total</th>
            <th>Processed</th>
            <th>Remaining Time</th>
          </tr>
        </thead>
        <tr>
          <td>
            <i class="material-icons rotating">fiber_smart_record</i>
          </td>
          <td>{{totalImages}}</td>
          <td>{{processedImages}}</td>
          <td>{{remainingTime}}</td>
        </tr>
      </table>
    </Transition>
  </div>
</template>

<script>
// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

const processingModule = require('../../../utilities/process.js')

export default {
  name: 'ExtractResult',

  data() {
    return {
      imageDirectory:
        'D:\\current\\image-parsing\\__tests__\\test-data\\images',
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
    inputIsValid() {
      return this.imageDirectory
    },

    remainingTime() {
      const ms =
        (this.totalImages - this.processedImages) * (this.perImageTime || 500)
      return this.toHHMMSS(ms)
    },
  },

  created() {
    processingModule.stop()
  },

  methods: {
    toggleProcess() {
      if (this.running) {
        processingModule.stop()

        this.processedImages = 0
        this.totalImages = 0
        this.totalWorkers = 0
        this.perImageTime = 0
      } else {
        processingModule
          .start(this.listner, this.imageDirectory, this.keyFilePath)
          .then(({ totalImages, totalWorkers }) => {
            this.totalImages = totalImages
            this.totalWorkers = totalWorkers
          })
          .catch(err => {
            dialog.showErrorBox('Error', err)
          })
      }
      this.running = !this.running
    },

    listner(m) {
      if (m.progress) {
        this.processedImages += 1

        if (!this.perImageTime) this.perImageTime = m.time
      } else if (m.results) {
        this.running = false

        this.$emit('results', m) // m contains both key and results
      } else if (m.log) {
        console.log('log: ', m.log)
      } else if (m.error) {
        dialog.showErrorBox('Error', m.error)
      }
    },

    chooseImageDirectory() {
      const dir = dialog.showOpenDialog(getCurrentWindow(), {
        title: 'Choose directory containing scanned answer sheets',
        defaultPath: this.imageDirectory,
        properties: ['openDirectory'],
      })

      this.imageDirectory = dir ? dir[0] : null
    },

    toHHMMSS(s) {
      let str = ''
      const input = s / 1000
      const hours = Math.floor(input / 3600)
      const minutes = Math.floor((input - hours * 3600) / 60)
      const seconds = (input - hours * 3600 - minutes * 60).toFixed(2)

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
table
  th, td
    text-align: center
</style>
