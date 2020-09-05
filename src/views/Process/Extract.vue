<template>
  <div class="section">
    <h1 class="title is-5">Process</h1>
    <h2 class="subtitle is-6">Process scanned images to generate result.</h2>

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
import { openDirectory, saveFile } from '@/utilities/electron-dialog'
import { exportJsonToExcel } from '@/utilities/excel'
import {
  // PROGRESS_STATES,
  WorkerManager,
} from '@/utilities/workers/WorkerManager'
import { KeyNativeEnum } from '@/utilities/readKey'
import Vue from 'vue/types/umd'

const workerManager = new WorkerManager()

export default {
  name: 'ExtractResult',

  data() {
    return {
      imagesDirectory:
        'D:\\Current\\image-parsing\\__tests__\\_data\\images-barcode\\',
      processedImages: 0,
      totalImages: 0,
      isRunning: false,
    }
  },

  computed: {
    inputIsValid() {
      return this.imagesDirectory
    },
  },

  methods: {
    chooseimagesDirectory() {
      openDirectory().then((dir) => {
        this.imagesDirectory = dir
      })
    },

    start() {
      console.log(workerManager)
    },

    /**
     * @param {import("../../utilities/CompiledResult").default | import("../../utilities/Result").ResultJson[]} compiledResult
     */
    exportData(compiledResult) {
      saveFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum).reverse(),
        },
      ]).then((destination) => {
        if (!destination) return
        exportJsonToExcel(compiledResult, destination)
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
