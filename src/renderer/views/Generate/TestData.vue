<template>
  <div class="section">
    <h1 class="title is-5">Generate</h1>
    <h2 class="subtitle is-6">
      Generate Answer Sheet sample with compiled result for verification.
    </h2>

    <div class="field">
      <label class="label">Result File</label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button @click="chooseResultFile" class="file-input" name="resume" />
          <span class="file-cta">
            <i class="material-icons">list</i>
            <span class="file-label">Choose File</span>
          </span>
          <span class="file-name">{{ resultFilePath }}</span>
        </label>
      </div>
    </div>

    <div class="field">
      <label class="label">Output directory:</label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <button
            :disabled="isRunning"
            @click="chooseExportDirectory"
            class="file-input"
            name="resume"
          />
          <span class="file-cta">
            <i class="material-icons">folder_open</i>
            <span class="file-label">Choose directory</span>
          </span>
          <span class="file-name">{{ exportDirectory }}</span>
        </label>
      </div>
      <p class="help">
        Choose the target directory for generated files.
      </p>
    </div>

    <br />

    <div class="buttons">
      <button
        :disabled="isRunning || !inputIsValid"
        @click="start"
        class="button is-primary"
      >
        <i class="material-icons">flash_on</i>
        <span>Process</span>
      </button>

      <button :disabled="!isRunning" @click="stop" class="button is-danger">
        <i class="material-icons">stop</i>
        <span>Stop</span>
      </button>
    </div>

    <Transition mode="out-in" name="slide-up">
      <div
        v-show="isRunning"
        class="notification is-primary botton-centered-content"
      >
        <progress
          :value="progress"
          max="100"
          class="progress is-success is-large"
        >
          {{ progress }}
        </progress>
        <div>
          <p>Files Processed: {{ processedImages }} / {{ totalImages }}</p>
          <p>Estimated Time Remaining: {{ remainingTime }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { currentWindow } from '../../../utilities/electron-utilities'
import { openDirectory, openFile } from '../../../utilities/electron-dialog'
import KeyNativeEnum from '../../../utilities/@enums/KeyNativeEnum'
import ProgressStateEnum from '../../../utilities/@enums/ProgressStateEnum'
import prettyMs from 'pretty-ms'
import WorkerManagerGenerateTestData from '../../../utilities/@classes/WorkerManagerGenerateTestData'

const workerManager = new WorkerManagerGenerateTestData()

export default {
  name: 'GenerateTestData',

  data() {
    return {
      exportDirectory: 'D:\\Current\\image-parsing\\.tmp\\',
      resultFilePath:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\compiledResult.xlsx',
      perImageTime: 0,
      processedImages: 0,
      progressState: ProgressStateEnum.STOPPED,
      totalImages: 0,
    }
  },

  computed: {
    inputIsValid() {
      return this.exportDirectory && this.resultFilePath
    },

    isRunning() {
      return this.progressState === ProgressStateEnum.RUNNING
    },

    progress() {
      return Math.floor((this.processedImages * 100) / this.totalImages)
    },

    remainingTime() {
      const ms = (this.totalImages - this.processedImages) * this.perImageTime
      return ms === 0 ? 'calculating...' : prettyMs(ms)
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

  unmounted() {},

  methods: {
    chooseExportDirectory() {
      openDirectory().then(dir => {
        this.exportDirectory = dir
      })
    },

    chooseResultFile() {
      openFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum),
        },
      ]).then(file => {
        this.resultFilePath = file
      })
    },

    start() {
      this.progressState = ProgressStateEnum.RUNNING

      workerManager.process({
        callbacks: {
          onsuccess: msg => {
            this.progressState = ProgressStateEnum.COMPLETED

            console.log('onsuccess',msg.data)
          },
          onprogress: msg => {
            this.perImageTime = msg.timeElapsed
            this.processedImages += 1
          },
          onerror: msg => {
            this.$toasted.show(msg.error, {
              type: 'error',
              icon: 'info',
            })
          },
        },
        data: {},
      })
    },

    stop() {
      workerManager.stop()

      this.perImageTime = 0
      this.processedImages = 0
      this.totalImages = 0
      this.progressState = ProgressStateEnum.STOPPED
    },
  },
}
</script>

<style scoped lang="scss">
.botton-centered-content {
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

.notification {
  padding: 0;
  padding-bottom: 1.5em;
}
</style>
