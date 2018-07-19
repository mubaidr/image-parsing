<template>
  <div class="section">
    <h1 class="title">Train Network</h1>

    <div class="block has-text-centered">
      <button
        :disabled="running"
        class="button is-primary"
        @click="startProcess">Start Training</button>

      <br>
      <br>
      <progress
        v-show="running"
        class="progress is-warning">0%</progress>

        <!-- TODO: display logs here: -->
    </div>
  </div>
</template>

<script>
const { fork } = require('child_process')

const worker = fork(`${__dirname}/../../utilities/train.js`, [], {
  silent: true,
})

export default {
  data() {
    return {
      running: false,
    }
  },

  methods: {
    startProcess() {
      worker.send({}, () => {
        this.running = true
      })

      worker.on('message', msg => {
        if (msg.completed) {
          this.running = false
        }
      })

      // logging
      worker.stdout.on('data', data => {
        console.log(data.toString())
      })

      // error
      worker.stderr.on('data', data => {
        console.log(data.toString())
      })
    },
  },
}
</script>

<style>
</style>
