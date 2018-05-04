<template>
  <div class="section">
    <h1 class="title">Train Network</h1>
    <br>

    <h2 class="subtitle">Design</h2>
    <load-files
      :is-file="true"
      file-type="design"
      option="train.source.design"/>

    <h2 class="subtitle">Images</h2>
    <load-files
      file-type="image"
      option="train.source.image"/>

    <h2 class="subtitle">Result</h2>
    <load-files
      :is-file="true"
      file-type="excel"
      option="train.source.excel"/>

    <hr>

    <h2 class="subtitle">Output</h2>
    <load-files
      :is-file="true"
      file-type="excel"
      option="train.target.data"/>

    <button
      class="button is-primary"
      @click="startProcess">Start Training</button>

    <button
      class="button is-danger"
      @click="stopProcess">Stop Training</button>
  </div>
</template>

<script>
import loadFiles from './Templates/LoadFiles'

const trainingModule = require('./Train/index')

export default {
  name: 'About',

  components: { loadFiles },

  methods: {
    async startProcess() {
      console.log('Starting process...')

      trainingModule.train()
    },

    async stopProcess() {
      console.log('Stoping process...')
    }
  }
}
</script>

<style>
</style>
