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
          <span
            v-if="isFile"
            class="file-label">
            Choose a file...
          </span>
          <span
            v-else
            class="file-label">
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
    <nav
      v-if="directory"
      class="panel">
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
import PreviewModal from './PreviewModal.vue'
// eslint-disable-next-line
const { remote } = require('electron')
const fastGlob = require('fast-glob')

export default {
  components: { PreviewModal },

  props: {
    fileType: {
      type: String,
      default: 'image', // or design or excel
    },

    isFile: {
      type: Boolean,
      default: false,
    },

    option: {
      type: String,
      default: 'generate.source.design',
    },
  },

  data() {
    return {
      directory: null,
      selectedFile: null,
      files: [],
      fileFilter: '',
    }
  },

  computed: {
    filteredFiles() {
      return this.files.filter(file => file.indexOf(this.fileFilter) !== -1)
    },
  },

  watch: {
    directory(val) {
      if (!val) {
        this.files = []
      } else {
        // read files
        fastGlob(
          `${this.directory}/*.{${this.options.validFormats[this.fileType].join(
            ',',
          )}}`,
          {
            onlyFiles: true,
          },
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
  },

  methods: {
    choosePath() {
      ;[this.directory] = remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
        defaultPath: this.defaultPath,
      }) || [false]

      this.selectedFile = null
    },

    extractName(str) {
      const index = str.lastIndexOf('/') + 1
      return str.substr(index)
    },
  },
}
</script>

<style lang="sass">
</style>
