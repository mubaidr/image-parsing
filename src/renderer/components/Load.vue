<template>
  <div>
    <div class="columns is-mobile">
      <div class="column is-10 is-iffset-1">
        <h1 class="title">Load</h1>

        <button class="button is-large"
                @click="choosePath">Select Folder</button>
        <span class="label">{{ normalizedDirectory }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const { dialog } = require('electron').remote

export default {
  data() {
    return {
      directory: ''
    }
  },
  computed: {
    normalizedDirectory() {
      return this.directory ? this.directory[0].replace(/(\\)/g, '\\') : ''
    }
  },
  methods: {
    choosePath() {
      this.directory = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
    }
  }
}
</script>

<style>

</style>
