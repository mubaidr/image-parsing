<template>
  <div>
    <h1>Progress</h1>

    <button
      class="button is-primary"
      @click="startProcess(true)">Start (multi threaded)</button>

    <button
      class="button is-dark"
      @click="startProcess(false)">Start (single threaded)</button>

    <button
      class="button is-danger"
      @click="stopProcess">Stop</button>
  </div>
</template>

<script>
const ProcessingModule = require('../../../utilities/process.js')

export default {
  methods: {
    async startProcess(useWorkers) {
      console.log('Starting process...')

      ProcessingModule.process(
        'D:\\Current\\image-parsing\\sample-data\\design\\AnswerSheet-1.svg',
        'D:\\Current\\image-parsing\\sample-data\\image\\Processed',
        'D:\\Current\\image-parsing\\sample-data\\result',
        useWorkers
      )
    },

    async stopProcess() {
      console.log('Stoping process...')
    },
  },
}
</script>

<style>
</style>
