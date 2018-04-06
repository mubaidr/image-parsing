<template>
  <div>
    <div class="section">
      <h1 class="title is-1">
        Choose Data Source
      </h1>
      <p>Choose a folder which contains answer sheet data image files.</p>
      <br/>
      <div class="columns">
        <div class="column is-4">
          <div class="box">
            <button class="button is-primary is-fullwidth"
                    @click="choosePath">Choose Source</button>
            <h2 class="subtitle is-6">{{ normalizedDirectory || 'No Source Selected' }}</h2>

            <ul>
              <li v-for="(file,index) in files"
                  :key="index"
                  class="tag is-fullwidth"
                  @click="previewFile = file">
                {{ file }}
              </li>
            </ul>
          </div>
        </div>
        <div class="column is-8">
          <template v-if="previewFile">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img :src="previewFilePath"
                       alt="Preview Image">
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ previewFile }}</p>
                    <p class="subtitle is-6">Filename</p>
                    <p>Other file details</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const path = require('path')
const fs = require('fs')
const { dialog } = require('electron').remote

export default {
  data() {
    return {
      directory: null,
      files: [],
      previewFile: null
    }
  },
  computed: {
    normalizedDirectory() {
      return this.directory ? this.directory.replace(/(\\)/g, '\\') : null
    },
    previewFilePath() {
      return path.join(this.normalizedDirectory, this.previewFile)
    }
  },
  watch: {
    directory(val) {
      if (val) {
        fs.readdir(val, (err, res) => {
          if (err) {
            this.files = []
            // alert(err)
          } else {
            this.files = res
          }
        })
      }
    }
  },
  methods: {
    choosePath() {
      ;[this.directory] = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
    }
  }
}
</script>

<style lang="sass">
.tag
  cursor: default
  user-select: none
  transition: all 0.25s ease-out
  &:hover
    background-color: rgba(0,0,0,0.1)
  &:active
    background-color: rgba(0,0,0,0.25)
  &.is-fullwidth
    width: 100%
    justify-content: left
</style>
