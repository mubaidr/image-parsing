<template>
  <div>
    <!-- <h1 class="title is-4">
      {{dataType}}
    </h1> -->
    <h2 class="subtitle is-6">Choose the folder which contains {{dataType}} files.</h2>

    <div class="columns">
      <div class="column is-4"
           :class="{'is-offset-4' : !selectedFile}">
        <h2 class="subtitle is-4">Source</h2>
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
              <span class="tag">{{ filteredFiles.length }} {{dataType}}s found in the selected directory.</span>
            </div>
            <div class="panel-block">
              <p class="control">
                <input v-model="fileFilter"
                       class="input is-small"
                       type="text"
                       placeholder="Search">
              </p>
            </div>
            <div class="panel-block">You can preview any {{dataType}} by clicking its name in the following
              list;
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
            <div class="notification is-warning">Selected directory does not contains any {{dataType}} files. </div>
          </template>
        </nav>
      </div>

      <div class="column"
           :class="{'is-hidden': !selectedFile}">
        <h2 class="subtitle is-4">Preview</h2>
        <preview-modal :file-path="selectedFile"
                       :file-type="fileType"
                       :is-file="isFile" />
      </div>
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
  transition: all 0.5s ease-out
</style>
