<template>
  <div class="section">
    <h1 class="title is-4">
      Train Network
    </h1>

    <form class="control">
      <div class="field">
        <label class="label">Result File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button @click="chooseKeyImage" class="file-input" name="resume" />
            <span class="file-cta">
              <i class="material-icons">list</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ keyImagePath }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">Key File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button @click="chooseKeyResult" class="file-input" name="resume" />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ keyResultPath }}</span>
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
          <li :key="index" v-for="(log, index) in logs">
            {{ log }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { fork } from 'child_process'
import path from 'path'

import { openFile } from '../../utilities/electron-dialog'
import ImageTypesEnum from '../../utilities/@enums/ImageTypesEnum'
import KeyNativeEnum from '../../utilities/@enums/KeyNativeEnum'

export default {
  data() {
    return {
      keyImagePath: 'D:\\Current\\image-parsing\\__tests__\\test-data\\key.jpg',
      keyResultPath:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\key.xlsx',
      logs: [],
      isRunning: false,
      worker: null,
    }
  },

  computed: {
    inputIsValid() {
      return this.keyImagePath !== null && this.keyResultPath !== null
    },
  },

  watch: {
    running(val) {
      if (val) {
        this.logs = []
      }
    },
  },

  methods: {
    start() {
      const workerPath =
        process.env.NODE_ENV === 'development'
          ? path.resolve('./dist/trainTaskWorker.js')
          : path.resolve(__dirname, './trainTaskWorker.js')

      this.worker = fork(workerPath, [], {
        silent: true,
      })

      this.worker.send({}, () => {
        this.running = true
      })

      this.worker.on('message', msg => {
        if (msg.completed) {
          this.running = false
          this.logs.unshift('Completed!')
        }
      })

      if (this.worker.stdout === null || this.worker.stderr === null) return

      // logging
      this.worker.stdout.on('data', data => {
        this.logs.unshift(data.toString())
      })

      // error
      this.worker.stderr.on('data', data => {
        this.logs.unshift(data.toString())
        this.running = false
      })
    },

    stop() {
      if (this.worker.connected) {
        this.worker.kill()
      }
    },

    chooseKeyImage() {
      openFile([
        {
          name: 'Image File',
          extensions: Object.keys(ImageTypesEnum),
        },
      ]).then(file => {
        this.keyFilePath = file
      })
    },

    chooseKeyResult() {
      openFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum),
        },
      ]).then(file => {
        this.resultFilePath = file
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
