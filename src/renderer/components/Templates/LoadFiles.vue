<template>
  <div>
    <h1 class="title is-4">Source</h1>
    <h2 class="subtitle is-6">Choose the folder which contains {{dataType}} files.</h2>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button class="file-input"
                name="resume"
                @click="choosePath">
        </button>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">
            Choose a directory...
          </span>
        </span>
        <span class="file-name">
          {{ directory || 'No Source Selected' }}
          <template v-if="directory">
            <i>({{ filteredFiles.length }} {{dataType}} files)</i>
          </template>
        </span>
      </label>
    </div>
    <nav class="panel">
      <template v-if="directory && filteredFiles.length">
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
        <div class="notification is-warning">Selected directory does not contains any {{dataType}} files. </div>
      </template>
    </nav>
    <div class="block has-text-centered"
         v-show="selectedFile">
      <preview-modal :file-path="selectedFile"
                     :file-type="fileType"
                     :is-file="isFile" />
    </div>
  </div>
</template>

<script>
import PreviewModal from './PreviewModal'

const fastGlob = require('fast-glob')

export default {
  components: { PreviewModal },

  props: {
    fileType: {
      type: String,
      Default: 'image' // or design or excel
    },
    isFile: {
      type: Boolean,
      Default: false
    }
  },

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

    dataType() {
      if (this.fileType === 'design') return 'Design'
      if (this.fileType === 'excel') return 'Excel'
      // if (this.fileType === 'image')
      return 'Images'
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
      fastGlob(
        `${val}/*.{${this.options.validFormats[this.fileType].join(',')}}`,
        {
          onlyFiles: true
        }
      )
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
      ;[this.directory] = this.$electron.remote.dialog.showOpenDialog({
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

.column
  transition: all 0.25s ease-out
</style>
