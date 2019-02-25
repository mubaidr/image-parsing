<template>
  <div>
    <div class="field">
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="running"
            @click="chooseDirectoryImages"
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
      <p class="help">Choose the directory which contains scanned answer sheets.</p>
    </div>

    <div class="field">
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="running"
            @click="chooseFileKey"
            class="file-input"
            name="resume"
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-folder"/>
            </span>
            <span class="file-label">Choose Key File</span>
          </span>
          <span class="file-name">{{ keyFile }}</span>
        </label>
      </div>
      <p class="help">Choose the Key file (scanned or csv)</p>
    </div>

    <br>

    <div class="buttons">
      <button
        :disabled="running || !inputIsValid"
        @click="toggleProcess"
        class="button is-primary"
      >
        <span class="icon">
          <i class="fa fa-play"/>
        </span>

        <span>Start</span>
      </button>

      <button
        :disabled="!running"
        @click="toggleProcess"
        class="button is-danger"
      >
        <span class="icon">
          <i class="fa fa-stop"/>
        </span>
        <span>Stop</span>
      </button>
    </div>

    <div class="fixed">
      <Transition
        mode="out-in"
        name="slide-down"
      >
        <div
          v-show="running"
          class="notification is-dark"
        >
          <span class="icon">
            <i class="fa fa-spinner"/>
          </span> Processed
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

const processingModule = require('../../../utilities/process.js')
const dataPaths = require('../../../utilities/data-paths.js')

export default {
  name: 'ExtractResult',

  data() {
    return {
      imageDirectory: dataPaths.DEFAULTS.images,
      keyFile: dataPaths.DEFAULTS.key,
      running: false,
      processedImages: 0,
      totalImages: 0,
      totalWorkers: 0,
      perImageTime: 1,
      startTime: 0,
      endTime: 0,
    }
  },

  computed: {
    inputIsValid() {
      return this.imageDirectory && this.keyFile
    },

    remainingTime() {
      const ms =
        500 +
        ((this.totalImages - this.processedImages) *
          (this.perImageTime || 1000)) /
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
    toggleProcess() {
      if (this.running) {
        processingModule.stop()
      } else {
        processingModule
          .start(this.listner, this.imageDirectory, this.keyFile)
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

        this.$emit('results', m.results)
      } else if (m.log) {
        console.log('log: ', m.log)
      } else if (m.error) {
        dialog.showErrorBox('Error', m.error)
      }
    },

    chooseDirectoryImages() {
      const dir = dialog.showOpenDialog(getCurrentWindow(), {
        defaultPath: this.imageDirectory,
        properties: ['openDirectory'],
      })

      this.imageDirectory = dir ? dir[0] : null
    },

    chooseFileKey() {
      const dir = dialog.showOpenDialog(getCurrentWindow(), {
        defaultPath: this.keyFile,
        properties: ['openFile'],
      })

      this.keyFile = dir ? dir[0] : null
    },

    toHHMMSS(s) {
      let str = ''
      const input = s / 1000
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
</style>
