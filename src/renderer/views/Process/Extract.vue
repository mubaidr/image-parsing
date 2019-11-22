<template>
  <div class="section">
    <h1 class="title is-5">
      Process
    </h1>
    <h2 class="subtitle is-6">
      Process scanned images to generate result.
    </h2>

    <div class="field">
      <label class="label">Scanned images directory:</label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="isRunning"
            class="file-input"
            name="resume"
            @click.stop.prevent="chooseimagesDirectory"
          />
          <span class="file-cta">
            <i class="material-icons">folder</i>
            <span class="file-label">Choose directory</span>
          </span>
          <span class="file-name">{{ imagesDirectory }}</span>
        </label>
      </div>
      <p class="help">
        Choose the directory containing scanned answer sheet files.
      </p>
    </div>

    <br />

    <div class="buttons">
      <button
        :disabled="isRunning || !inputIsValid"
        class="button is-light"
        @click.stop.prevent="start"
      >
        <i class="material-icons">play_arrow</i>
        <span>Process</span>
      </button>

      <button
        :disabled="!isRunning"
        class="button is-light"
        @click.stop.prevent="stop"
      >
        <i class="material-icons">stop</i>
        <span>Stop</span>
      </button>
    </div>

    <Transition mode="out-in" name="slide-up">
      <div
        v-show="isRunning"
        class="notification is-primary bottom-centered-content"
      >
        <progress
          :value="progress"
          max="100"
          class="progress is-success is-large"
        >
          {{ progress }}
        </progress>

        <div class="columns is-mobile">
          <div class="column">
            <span>{{ timeElapsed }}</span>
            <br />
            <span class="tag is-dark">Time Elapsed</span>
          </div>
          <div class="column">
            <span>{{ processedImages }}/{{ totalImages }}</span>
            <br />
            <span class="tag is-dark">File Processed</span>
          </div>
          <div class="column">
            <span>{{ remainingTime }}</span>
            <br />
            <span class="tag is-dark">Estimated Remaining Time</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { currentWindow } from '../../../utilities/electron-utilities'
import { openDirectory, saveFile } from '../../../utilities/electron-dialog'
import { exportJsonToExcel } from '../../../utilities/excel'
import KeyNativeEnum from '../../../utilities/@enums/KeyNativeEnum'
import ProgressStateEnum from '../../../utilities/@enums/ProgressStateEnum'
import prettyMs from 'pretty-ms'
import WorkerManagerExtract from '../../../utilities/@classes/WorkerManagerExtract'

const workerManager = new WorkerManagerExtract()

export default {
  name: 'ExtractResult',

  data() {
    return {
      imagesDirectory:
        'D:\\Current\\image-parsing\\__tests__\\_data\\images-barcode\\',
      perImageTime: 0,
      processedImages: 0,
      progressState: ProgressStateEnum.STOPPED,
      totalImages: 0,
      totalWorkers: 0,
      timer: 0,
      timerInterval: null,
    }
  },

  computed: {
    inputIsValid() {
      return this.imagesDirectory
    },

    isRunning() {
      return this.progressState === ProgressStateEnum.RUNNING
    },

    progress() {
      return Math.floor((this.processedImages * 100) / this.totalImages)
    },

    remainingTime() {
      const ms =
        (this.totalImages - this.processedImages) *
        ((this.perImageTime || 500) / (this.totalWorkers || 1))

      return ms === 0 ? '...' : prettyMs(ms)
    },

    timeElapsed() {
      return prettyMs(this.timer * 1000)
    },
  },

  watch: {
    // set taskbar progress
    processedImages(val) {
      if (val < this.totalImages) {
        currentWindow.setProgressBar(val / this.totalImages)
      } else {
        currentWindow.setProgressBar(0)

        // flash taskbar icon
        if (currentWindow.isFocused()) {
          window.setTimeout(() => {
            currentWindow.flashFrame(false)
          }, 1000)
        } else {
          currentWindow.once('focus', () => currentWindow.flashFrame(false))
        }
        currentWindow.flashFrame(true)
      }
    },
  },

  unmounted() {
    this.stop()
  },

  methods: {
    chooseimagesDirectory() {
      openDirectory().then(dir => {
        this.imagesDirectory = dir
      })
    },
    start() {
      // start procesing
      workerManager
        .process({
          callbacks: {
            onsuccess: msg => {
              this.progressState = ProgressStateEnum.COMPLETED
              this.exportData(msg.data)
              this.stop()
            },
            onprogress: msg => {
              this.perImageTime = msg.timeElapsed
              this.processedImages += 1
            },
            onerror: msg => {
              console.error(msg)

              this.$toasted.show(msg.error, {
                type: 'error',
                icon: 'info',
              })
            },
          },
          data: { imagesDirectory: this.imagesDirectory },
        })
        .then(({ totalOutput, totalWorkers }) => {
          this.totalImages = totalOutput
          this.totalWorkers = totalWorkers
        })

      // set running state
      this.progressState = ProgressStateEnum.RUNNING

      // timer
      this.timer = 0
      this.timerInterval = setInterval(() => {
        this.timer += 1
      }, 1000)
    },

    stop() {
      workerManager.stop()

      clearInterval(this.timerInterval)
      this.timer = 0
      this.perImageTime = 0
      this.processedImages = 0
      this.totalImages = 0
      this.progressState = ProgressStateEnum.STOPPED
    },

    exportData(compiledResult) {
      saveFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum).reverse(),
        },
      ]).then(destination => {
        if (!destination) return

        // TODO: save to tmp file for later restore
        // TODO: use streams to write processed data

        exportJsonToExcel(compiledResult, destination)

        this.$toasted.show('Result exported successfully. ', {
          icon: 'check_circle',
          type: 'success',
          duration: 5000,
          keepOnHover: true,
          action: {
            text: 'Open for Review',
            class: 'has-text-white has-text-underlined',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
              this.$router.push(`/process/review?resultFilePath=${destination}`)
            },
          },
        })
      })
    },
  },
}
</script>

<style scoped lang="scss">
.bottom-centered-content {
  font-family: monospace !important;
}
</style>
