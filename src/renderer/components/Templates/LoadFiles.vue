<template>
  <div class="block">
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          name="resume"
          @click="choosePath" />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload" />
          </span>
          <span class="file-label">
            Choose a directory...
          </span>
        </span>
        <span class="file-name">
          {{ directory || 'No Source Selected' }}
          <template v-if="directory">
            <i>({{ filteredFiles.length }} {{ fileType }} files)</i>
          </template>
        </span>
      </label>
    </div>
    <nav class="panel">
      <template v-if="directory && filteredFiles.length">
        <div class="fixed-height">
          <a
            v-for="(file,index) in filteredFiles"
            :class="{'is-active' : file === selectedFile}"
            :key="index"
            class="panel-block"
            @click="selectedFile = file">
            {{ extractName(file) }}
          </a>
        </div>
      </template>
      <template v-if="directory && !filteredFiles.length">
        <div class="notification is-warning">Selected directory does not contains any {{ fileType }} files. </div>
      </template>
    </nav>
    <div
      v-show="selectedFile"
      class="block has-text-centered">
      <preview-modal
        :file-path="selectedFile"
        :file-type="fileType" />
    </div>
  </div>
</template>

<script>
import _set from 'lodash/set'
import PreviewModal from './PreviewModal'

const fastGlob = require('fast-glob')

export default {
  components: { PreviewModal },

  props: {
    fileType: {
      type: String,
      default: 'image' // or design or excel
    },

    isFile: {
      type: Boolean,
      default: false
    },

    option: {
      type: String,
      default: 'generate.source.design'
    }
  },

  data() {
    return {
      directory: null,
      selectedFile: null,
      files: [],
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
      } else {
        // read files
        fastGlob(
          `${this.directory}/*.{${this.options.validFormats[this.fileType].join(
            ','
          )}}`,
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

    selectedFile(val) {
      this.updateOptions('file')
    }
  },

  methods: {
    choosePath() {
      ;[this.directory] = this.$electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
        defaultPath: this.defaultPath
      }) || [false]

      this.selectedFile = null

      // update options
      this.updateOptions()
    },

    extractName(str) {
      const index = str.lastIndexOf('/') + 1
      return str.substr(index)
    },

    updateOptions(updateType) {
      const opt = JSON.parse(JSON.stringify(this.options))
      const optionPath = this.option

      if (updateType === 'file') {
        _set(opt, `${optionPath}File`, this.selectedFile)
      } else {
        _set(opt, optionPath, this.directory)
      }

      this.setOptions(opt)
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
