<template>
  <div class="section">
    <h1 class="title">Train Network</h1>

    <div class="block has-text-centered">
      <button :disabled="running" class="button is-dark" @click="startProcess">
        Start Training
      </button>

      <br />
      <br />
      <Transition name="slide-up">
        <div v-show="running">
          <progress class="progress is-warning"> 0% </progress> <br />
          <div class="block">
            <ul>
              <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
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
      })
    },
  },
}
</script>

<style></style>
