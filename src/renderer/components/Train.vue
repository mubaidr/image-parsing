<template>
  <div class="section">
    <h1 class="title is-4">Train Network</h1>

    <div class="block has-text-centered">
      <button
        @click="start"
        class="button is-primary"
      >Start</button>

      <button
        :disabled="running"
        @click="startProcess"
        class="button is-primary"
      >Start Process</button>

      <button
        :disabled="!running"
        @click="stopProcess"
        class="button is-danger"
      >Stop Process</button>

      <div class="block log">
        <ul>
          <li
            :key="index"
            v-for="(log, index) in logs"
          >{{ log }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { fork } from 'child_process'
import * as trainingProcess from '../../utilities/train.js'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      logs: [],
      running: false,
      worker: null,
    }
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
      trainingProcess.start()
    },

    startProcess() {
      this.worker = fork(`${__dirname}/src/utilities/train.js`, [], {
        silent: true,
      })

      this.worker.send({}, () => {
        this.running = true
      })

      this.worker.on('message', msg => {
        if (msg.completed) {
          this.running = false
        }
      })

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

    stopProcess() {
      this.worker.send(
        {
          stop: true,
        },
        () => {
          this.running = false
        }
      )
    },
  },
})
</script>

<style lang="sass">
.log
  font-size: smaller
</style>
