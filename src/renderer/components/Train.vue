<template>
  <div class="section">
    <h1 class="title">Train Network</h1>

    <button
      class="button is-primary"
      @click="startProcess">Start Training</button>

    <button
      class="button is-danger"
      @click="stopProcess">Stop Training</button>
  </div>
</template>

<script>
import loadFiles from './Templates/LoadFiles.vue'

const trainingModule = require('../../utilities/train.js')

export default {
  name: 'About',

  components: { loadFiles },

  methods: {
    async startProcess() {
      trainingModule.train()
    },

    async stopProcess() {
      console.log('Stoping process...')
    },
  },
}
</script>

<style>
</style>
