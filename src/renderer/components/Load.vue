<template>
  <div>
    <div class="section">
      <h1 class="title is-1">
        Choose Data Source
      </h1>
      <p>Choose a folder which contains answer sheet data image files.</p>
      <br>
      <div class="columns is-mobile">
        <div class="column is-4 is-offset-4">
          <nav class="panel">
            <p class="panel-heading">
              {{ normalizedDirectory || 'No Source Selected' }}
            </p>
            <div class="panel-block">
              <button class="button is-primary is-fullwidth"
                      @click="choosePath">
                Change Directory
              </button>
            </div>
            <template v-if="directory && files.length">
              <div class="panel-block">
                <p class="control has-icons-left">
                  <input v-model="fileFilter"
                         class="input is-small"
                         type="text"
                         placeholder="Search">
                </p>
              </div>
              <a v-for="(file,index) in filteredFiles"
                 :class="{'is-active' : file === previewFile}"
                 :key="index"
                 class="panel-block"
                 @click="previewFile = file">
                {{ file }}
              </a>
            </template>
            <template v-if="directory && !files.length">
              <div class="notification is-warning">Selected directory does not contains valid image files. </div>
            </template>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const path = require('path')
const fs = require('fs')
// eslint-disable-next-line
const { dialog } = require('electron').remote

export default {
  data() {
    return {
      directory: null,
      files: [],
      previewFile: null,
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
            this.files = res.map(file =>
              file.replace(file.substring(file.lastIndexOf('.')), '')
            )
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
.column
  transition: all 0.25s ease-out

.fixed-height
  max-height: 420px
  overflow: auto
</style>
