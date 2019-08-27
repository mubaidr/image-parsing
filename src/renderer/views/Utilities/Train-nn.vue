<template>
  <div class="section">
    <h1 class="title is-4">
      Train Network
    </h1>

    <form class="control">
      <div class="field">
        <label class="label">Design File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              @click="chooseDesignPath"
              class="file-input"
              name="resume"
            />
            <span class="file-cta">
              <i class="material-icons">list</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ designPath }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">Result File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              @click="chooseResultPath"
              class="file-input"
              name="resume"
            />
            <span class="file-cta">
              <i class="material-icons">list</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ resultPath }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">Key File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button @click="choosekeyPath" class="file-input" name="resume" />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ keyPath }}</span>
          </label>
        </div>
      </div>

      <br />

      <div class="buttons">
        <button
          :disabled="!inputIsValid"
          @click="start"
          class="button is-primary"
        >
          <i class="material-icons">play_arrow</i>
          <span>Train</span>
        </button>

        <button :disabled="isRunning" @click="stop" class="button is-danger">
          <i class="material-icons">stop</i>
          <span>Stop</span>
        </button>
      </div>
    </form>

    <div class="block has-text-centered">
      <div class="block log">
        <ul>
          <li v-for="(log, index) in logs" :key="index">
            {{ log }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { openFile } from '../../../utilities/electron-dialog'
import ImageTypesEnum from '../../../utilities/@enums/ImageTypesEnum'
import KeyNativeEnum from '../../../utilities/@enums/KeyNativeEnum'
import WorkerManagerTrain from '../../../utilities/@classes/WorkerManagerTrain'

let workerManager = new WorkerManagerTrain()

export default {
  data() {
    return {
      designPath:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\design.svg',
      resultPath: 'D:\\Current\\image-parsing\\__tests__\\test-data\\key.xlsx',
      keyPath: 'D:\\Current\\image-parsing\\__tests__\\test-data\\key.jpg',
      logs: [],
      isRunning: false,
    }
  },

  computed: {
    inputIsValid() {
      return (
        this.designPath !== null &&
        this.resultPath !== null &&
        this.keyPath !== null
      )
    },
  },

  watch: {
    running(val) {
      if (val) {
        this.logs = []
      }
    },
  },

  unmounted() {
    workerManager.stop()
  },

  methods: {
    start() {
      workerManager.process({
        callbacks: {
          onsuccess: this.onsuccess,
          onprogress: this.onprogress,
        },
        data: {
          designPath: this.designPath,
          resultPath: this.resultPath,
          keyPath: this.keyPath,
        },
      })
    },

    stop() {
      workerManager.stop()

      this.isRunning = false
    },

    onsuccess() {
      console.log('onsuccess')
    },

    onprogress() {
      console.log('onprogress')
    },

    chooseDesignPath() {
      openFile([
        {
          name: 'SVG File',
          extensions: ['.svg'],
        },
      ]).then(file => {
        this.designPath = file
      })
    },

    chooseResultPath() {
      openFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum),
        },
      ]).then(file => {
        this.resultPath = file
      })
    },

    choosekeyPath() {
      openFile([
        {
          name: 'Image File',
          extensions: Object.keys(ImageTypesEnum),
        },
      ]).then(file => {
        this.keyPath = file
      })
    },
  },
}
</script>

<style lang="scss">
.log {
  font-size: smaller;
}
</style>
