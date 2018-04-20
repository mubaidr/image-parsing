<template>
  <div>
    <h1 class="title is-5">
      Choose Data Source
    </h1>
    <h2 class="subtitle is-5">Choose the folder which contains scanned answer sheet image files.</h2>
    <div class="columns">
      <div class="column is-6-tablet is-offset-3-tablet is-4-desktop is-offset-4-desktop">
        <nav class="panel">
          <p class="panel-heading">
            {{ normalizedDirectory || 'No Source Selected' }}
          </p>
          <div class="panel-block has-text-centered">
            <button class="button is-fullwidth"
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
                <input v-model="fileFilter"
                       class="input is-small"
                       type="text"
                       placeholder="Search">
              </p>
            </div>
            <div class="fixed-height">
              <a v-for="(file,index) in filteredFiles"
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
      <image-modal :file-path="selectedFilePath"
                   @close="selectedFile = null" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imageModal from './ImageModal'
const tinyGlob = require('tiny-glob')
const path = require('path')

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
      if (!val) {
        this.files = []
        return
      }

      // const dir = val.replace(/\\/g, '/')

      tinyGlob(`${val}/*.{${this.options.validImageFormats.join(',')}}`, {
        filesOnly: true
      })
        .then(files => {
          console.log(files)
          this.files = files
        })
        .catch(err => {
          this.files = []
          console.log(err)
        })
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
