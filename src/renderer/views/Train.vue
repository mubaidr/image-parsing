<template>
  <div class="section">
    <h1 class="title is-4">
      Train Network
    </h1>
    <!-- TODO: to add key, selection and result selection -->
    <div class="block has-text-centered">
      <button @click="start" class="button is-primary">
        Start
      </button>

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
import * as trainingProcess from '../../utilities/train.ts'

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
    start() {
      trainingProcess.start()
    },
  },
}
</script>

<style lang="scss">
.log {
  font-size: smaller;
}
</style>
