<template>
  <div class="section">
    <h1 class="title is-5">
      Process
    </h1>
    <h2 class="subtitle is-6">
      Process scanned images to generate result.
    </h2>
    <div class="field">
      <label class="label">Scanned Images Directory</label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="isRunning"
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
      <p class="help">
        Choose the directory which contains scanned answer sheets.
      </p>
    </div>

    <br />

    <div class="buttons">
      <button
        :disabled="isRunning || !inputIsValid"
        @click="startProcess"
        class="button is-primary"
      >
        <i class="material-icons">flash_on</i>
        <span>Process</span>
      </button>

      <button
        :disabled="!isRunning"
        @click="stopProcess"
        class="button is-danger"
      >
        <i class="material-icons">stop</i>
        <span>Stop</span>
      </button>
    </div>

    <Transition mode="out-in" name="slide-down">
      {{ processedImages }} / {{ totalImages }}
    </Transition>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapActions } from 'vuex'
import { openDirectory, saveFile } from '../../utilities/electron-dialog'
import { exportJsonToExcel } from '../../utilities/excel'
import KeyNativeEnum from '../../utilities/@enums/KeyNativeEnum'
import * as processingModule from '../../utilities/process'
import ProgressStateEnum from '../../utilities/@enums/ProgressStateEnum'
import prettyMs from 'pretty-ms'

const mainWindow = remote.getCurrentWindow()

export default {
  name: 'ExtractResult',

  data() {
    return {
      imageDirectory:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\images-barcode\\',
      perImageTime: 0,
      processedImages: 0,
      progressState: ProgressStateEnum.STOPPED,
      totalImages: 0,
    }
  },

  computed: {
    inputIsValid() {
      return this.imageDirectory
    },

    isRunning() {
      return this.progressState === ProgressStateEnum.RUNNING
    },

    progress() {
      return Math.floor((this.processedImages * 100) / this.totalImages)
    },

    remainingTime() {
      const ms = (this.totalImages - this.processedImages) * this.perImageTime
      return prettyMs(ms)
    },
  },

  watch: {
    // set taskbar progress
    processedImages(val) {
      if (val < this.totalImages) {
        mainWindow.setProgressBar(val / this.totalImages)
      } else {
        mainWindow.setProgressBar(0)

        // flash taskbar icon
        if (mainWindow.isFocused()) {
          window.setTimeout(() => {
            mainWindow.flashFrame(false)
          }, 1000)
        } else {
          mainWindow.once('focus', () => mainWindow.flashFrame(false))
        }
        mainWindow.flashFrame(true)
      }
    },
  },

  created() {
    processingModule.stop()
  },

  methods: {
    ...mapActions(['setCompiledResult']),

    startProcess() {
      this.progressState = ProgressStateEnum.RUNNING

      processingModule
        .start(this.callback, this.imageDirectory)
        .then(({ totalImages }) => {
          this.totalImages = totalImages
        })
        .catch(err => {
          this.$toasted.show(err, {
            type: 'error',
          })
        })
    },

    stopProcess() {
      processingModule.stop()

      this.perImageTime = 0
      this.processedImages = 0
      this.progressState = ProgressStateEnum.STOPPED
      this.totalImages = 0
    },

    callback(m) {
      switch (m.state) {
        case ProgressStateEnum.RUNNING:
          this.perImageTime = (this.perImageTime + m.time) / 2
          this.processedImages += 1
          break
        case ProgressStateEnum.COMPLETED:
          mainWindow.setProgressBar(0)
          this.stopProcess()
          this.exportData(m.compiledResult)
          break
        case ProgressStateEnum.ERROR:
          this.$toasted.show(m.error, {
            type: 'error',
          })
          break
      }

      this.progressState = m.state
    },

    exportData(compiledResult) {
      saveFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum).reverse(),
        },
      ]).then(destination => {
        if (!destination) return

        exportJsonToExcel(compiledResult, destination)

        this.$toasted.show('File Saved successfully. ', {
          type: 'info',
          duration: 5000,
          action: {
            text: 'Review Extracted Result Now',
            onClick: () => {
              this.setCompiledResult(compiledResult)
              this.$router.push('review')
            },
          },
        })
      })
    },

    chooseImageDirectory() {
      openDirectory().then(dir => {
        this.imageDirectory = dir
      })
    },
  },
}
</script>

<style scoped lang="scss">
</style>
