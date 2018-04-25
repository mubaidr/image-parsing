<template>
  <div>
    <div class="columns">
      <div class="column is-8-tablet is-offset-2-tablet is-4-desktop is-offset-4-desktop">
        <h1 class="title is-4">
          Data Source
        </h1>
        <h2 class="subtitle is-6">Choose the folder which contains scanned answer sheet image files.</h2>
        <nav class="panel">
          <p class="panel-heading">
            {{ directory || 'No Source Selected' }}
          </p>
          <div class="panel-block has-text-centered">
            <button class="button is-primary is-fullwidth"
                    @click="choosePath">
              Change Directory
            </button>
          </div>
          <template v-if="directory && filteredFiles.length">
            <div class="panel-block">
              <span class="tag">{{ filteredFiles.length }} images found in the selected directory.</span>
            </div>
            <div class="panel-block">
              <p class="control">
                <input v-model="fileFilter"
                       class="input is-small"
                       type="text"
                       placeholder="Search">
              </p>
            </div>
            <div class="panel-block">You can preview any image by clicking its name in the following list;
            </div>
            <div class="fixed-height">
              <a v-for="(file,index) in filteredFiles"
                 :class="{'is-active' : file === selectedFile}"
                 :key="index"
                 class="panel-block"
                 @click="selectedFile = file">
                {{ extractName(file) }}
              </a>
            </div>
          </template>
          <template v-if="directory && !filteredFiles.length">
            <div class="notification is-warning">Selected directory does not contains any image files. </div>
          </template>
        </nav>
      </div>
      <image-modal :file-path="selectedFile"
                   @close="selectedFile = null" />
    </div>
  </div>
</template>

<script>
import imageModal from './ImageModal'

const fastGlob = require('fast-glob')

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
    }
  },

  watch: {
    directory(val) {
      if (!val) {
        this.files = []
        return
      }

      // update options
      this.$emit('directory', this.directory)

      // read files
      fastGlob(`${val}/*.{${this.options.validImageFormats.join(',')}}`, {
        onlyFiles: true
      })
        .then(files => {
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
    },

    extractName(str) {
      const index = str.lastIndexOf('/') + 1
      return str.substr(index)
    }
  }
}
</script>

<style lang="sass">
.fixed-height
  max-height: 25em
  overflow: auto
</style>
