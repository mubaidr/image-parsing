<template>
  <div :class="{'is-active': filePath}"
       class="modal">
    <div class="modal-background"
         @click="$emit('close');"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="filePathData"
                 alt="Preview Image">
          </figure>
        </div>
        <div class="card-content has-text-centered">
          <p>{{ filePath }}</p>
        </div>
      </div>
    </div>
    <button ref="btnClose"
            class="modal-close is-large"
            @click="$emit('close');"
            @keyup.esc="$emit('close');"
            aria-label="close"
            autofocus></button>
  </div>
</template>

<script>
const path = require('path')
const sharp = require('sharp')

export default {
  props: ['filePath'],
  data() {
    return {
      filePathData: null
    }
  },
  watch: {
    filePath(val) {
      if (!val) {
        this.filePathData = null
        return
      }

      const dotIndex = val.lastIndexOf('.')
      const ext = val.substring(dotIndex + 1).toLowerCase()

      if (ext.indexOf('tif') !== -1) {
        const imgOutputPath = path.join(global.__paths.tmp, 'preview.png')
        const img = sharp(val)
          .png()
          .toFile(imgOutputPath)
          .then(() => {
            this.filePathData = imgOutputPath
          })
      } else {
        this.filePathData = this.filePath
      }

      this.$nextTick(() => {
        this.$refs.btnClose.focus()
      })
    }
  }
}
</script>

<style>

</style>
