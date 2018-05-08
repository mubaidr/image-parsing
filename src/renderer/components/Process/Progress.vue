<template>
  <div>
    <h1>Progress</h1>

    <button
      class="button is-primary"
      @click="startProcess">Start Proccesing</button>

    <button
      class="button is-danger"
      @click="stopProcess">Stop Proccesing</button>
  </div>
</template>

<script>
const ProcessingModule = require('./index')

export default {
  methods: {
    async startProcess() {
      console.log('Starting process...')

      ProcessingModule.process()
    },

    async stopProcess() {
      console.log('Stoping process...')
    }
  }
}
</script>

<style>

</style>
