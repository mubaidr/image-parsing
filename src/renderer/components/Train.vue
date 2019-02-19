<template>
  <div class="section">
    <h1 class="title">Train Network</h1>

    <div class="block has-text-centered">
      <button
        :disabled="running"
        @click="startProcess"
        class="button is-dark"
      >Start Training</button>

      <br>
      <br>
      <Transition name="slide-up">
        <div>
          <progress
            v-show="running"
            class="progress is-warning"
          >0%</progress>
          <br>
          <div class="block log">
            <ul>
              <li
                :key="index"
                v-for="(log, index) in logs"
              >{{ log }}</li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
const { fork } = require('child_process')

export default {
  data() {
    return {
      logs: [],
      running: false,
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
    startProcess() {
      const worker = fork(`${__dirname}/../../utilities/train.js`, [], {
        silent: true,
      })

      worker.send({}, () => {
        this.running = true
      })

      worker.on('message', msg => {
        if (msg.completed) {
          this.running = false
          this.logs.unshift('COMPLETED!')
        }
      })

      // logging
      worker.stdout.on('data', data => {
        this.logs.unshift(data.toString())
      })

      // error
      worker.stderr.on('data', data => {
        this.logs.unshift(data.toString())
        this.running = false
      })
    },
  },
}
</script>

<style lang="sass">
.log
  text-align: left
  font-size: smaller
</style>
