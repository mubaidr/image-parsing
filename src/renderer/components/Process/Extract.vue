<template>
  <div>
    <div class="field">
      <div class="file is-small has-name is-fullwidth">
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

    <div class="field">
      <div class="file is-small has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="running"
            @click="choosekeyFilePath"
            class="file-input"
            name="resume"
          />
          <span class="file-cta">
            <i class="material-icons">attach_file</i>
            <span class="file-label">Choose Key File</span>
          </span>
          <span class="file-name">{{ keyFilePath }}</span>
        </label>
      </div>
      <p class="help">Choose the key file</p>
    </div>

    <br>

    <div class="buttons">
      <button
        :disabled="running || !inputIsValid"
        @click="toggleProcess"
        class="button is-small is-primary"
      >
        <i class="material-icons">flash_on</i>
        <span>Process</span>
      </button>

      <button
        :disabled="!running"
        @click="toggleProcess"
        class="button is-small is-danger"
      >
        <i class="material-icons">stop</i>
        <span>Stop</span>
      </button>
    </div>

    <div
      v-show="running"
      class="fixed"
    >
      <Transition
        mode="out-in"
        name="slide-down"
      >
        <div class="notification is-info">
          <i class="material-icons is-pulled-left rotating">fiber_smart_record</i>
          Processed
          <strong>{{processedImages}}</strong> of
          <strong>{{totalImages}}</strong>. Remaining Time:
          <strong>{{remainingTime}}</strong>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

const { KEY } = require('../../../utilities/valid-types.js')

const processingModule = require('../../../utilities/process.js')
const dataPaths = require('../../../utilities/data-paths.js')

export default {
  name: 'ExtractResult',

  data() {
    return {
      imageDirectory: dataPaths.DEFAULTS.images,
      keyFilePath: dataPaths.DEFAULTS.key,
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
      return this.imageDirectory && this.keyFilePath
    },

    remainingTime() {
      const ms =
        (this.totalImages - this.processedImages) * (this.perImageTime || 500)
      return this.toHHMMSS(ms)
    },
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

    choosekeyFilePath() {
      const dir = dialog.showOpenDialog(getCurrentWindow(), {
        title: 'Choose result-key file',
        defaultPath: this.keyFilePath,
        properties: ['openFile'],
        filters: [
          {
            name: 'Key File',
            extensions: KEY,
          },
        ],
      })

      this.keyFilePath = dir ? dir[0] : null
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
</style>
