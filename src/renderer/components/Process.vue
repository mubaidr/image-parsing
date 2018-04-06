<template>
  <div>
    <div class="section">
      <h1 class="title is-1">
        Choose Data Source
      </h1>
      <p>Choose a folder which contains answer sheet data image files.</p>
      <br/>
      <div class="columns">
        <div class="column"
             :class="previewFile ? 'is-4' : 'is-12'">
          <nav class="panel">
            <p class="panel-heading">
              {{ normalizedDirectory || 'No Source Selected' }}
            </p>
            <div class="panel-block">
              <p class="control has-icons-left">
                <input class="input"
                       type="text"
                       placeholder="Search" />
              </p>
            </div>
            <a class="panel-block">
              <span class="panel-icon">
                <i class="fas fa-book" />
              </span>
              bulma
            </a>
            <div class="panel-block">
              <button class="button is-primary is-fullwidth"
                      @click="choosePath">
                Choose Directory
              </button>
            </div>
          </nav>
          <aside class="menu">
            <p class="menu-label">
              {{ normalizedDirectory || 'No Source Selected' }}
            </p>
            <ul class="menu-list fixed-height">
              <li v-for="(file,index) in files"
                  :key="index"
                  :class="{'is-active' : file === previewFile}"
                  @click="previewFile = file">
                <a>
                  {{ file }}
                </a>
              </li>
            </ul>
          </aside>
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
.column
  transition: all 0.25s ease-out

.fixed-height
  max-height: 420px
  overflow: auto
</style>
