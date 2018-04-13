<template>
  <div>
    <div class="section">
      <div class="header">
        <h1 class="title is-1">
          Choose Data Source
        </h1>
        <p>Choose the folder which contains answer sheet data image files.</p>
      </div>
      <br>
      <div class="panel-block">
        <button 
          class="button is-primary is-fullwidth"
          @click="choosePath">
          Next Step
        </button>
      </div>
      <div class="columns">
        <div class="column is-6-tablet is-offset-3-tablet is-4-desktop is-offset-4-desktop">
          <nav class="panel">
            <p class="panel-heading">
              {{ normalizedDirectory || 'No Source Selected' }}
            </p>
            <div class="panel-block has-text-centered">
              <button 
                class="button is-fullwidth"
                @click="choosePath">
                Change Directory
              </button>
            </div>
            <template v-if="directory && files.length">
              <div class="panel-block">
                <div class="tag"> {{ files.length }} images found in the selected directory. </div>
              </div>
              <div class="panel-block">You can preview any image by clicking its name in the following list;
              </div>
              <div class="panel-block">
                <p class="control">
                  <input 
                    v-model="fileFilter"
                    class="input is-small"
                    type="text"
                    placeholder="Search">
                </p>
              </div>
              <div class="fixed-height">
                <a 
                  v-for="(file,index) in filteredFiles"
                  :class="{'is-active' : file === selectedFile}"
                  :key="index"
                  class="panel-block"
                  @click="selectedFile = file">
                  {{ file }}
                </a>
              </div>
            </template>
            <template v-if="directory && !files.length">
              <div class="notification is-warning">Selected directory does not contains any image files. </div>
            </template>
          </nav>
        </div>
        <image-modal 
          :file-path="selectedFilePath"
          @close="selectedFile = null"/>
      </div>
    </div>
  </div>
</template>

<script>
import imageModal from './Templates/image-modal'
const path = require('path')
const fs = require('fs')
// eslint-disable-next-line
const { dialog } = require('electron').remote

export default {
  components: { imageModal },
  data() {
    return {
      directory: null,
      files: [],
      selectedFile: null,
      fileFilter: ''
    }
  },
  computed: {
    filteredFiles() {
      return this.files.filter(file => file.indexOf(this.fileFilter) !== -1)
    },
    normalizedDirectory() {
      return this.directory ? this.directory.replace(/(\\)/g, '\\') : null
    },
    selectedFilePath() {
      return this.selectedFile
        ? path.join(this.normalizedDirectory, this.selectedFile)
        : null
    }
  },
  watch: {
    directory(val) {
      if (val) {
        fs.readdir(val, (err, res) => {
          if (err) {
            this.files = []
          } else {
            this.files = res.filter(file => {
              const dotIndex = file.lastIndexOf('.')
              if (dotIndex === -1) return false

              const ext = file.substring(dotIndex + 1).toLowerCase()
              return this.imageFormats.indexOf(ext) !== -1
            })
          }
        })
      } else {
        this.files = []
      }
    }
  },
  methods: {
    choosePath() {
      ;[this.directory] = dialog.showOpenDialog({
        properties: ['openDirectory']
      }) || [false]
    }
  }
}
</script>

<style lang="sass">
.fixed-height
  max-height: 25em
  overflow: auto
</style>
