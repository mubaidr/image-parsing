<template>
  <div :class="{'is-active': filePath}"
       class="modal">
    <div class="modal-background"
         @click="$emit('close');" />
    <div class="modal-content">
      <div class="card">
        <div class="card-image">
          <template v-if="type === 'image'">
            <figure class="image">
              <img :src="filePathData"
                   alt="Preview Image">
            </figure>
          </template>
          <template v-if-else="type === 'design'">
            <canvas></canvas>
          </template>
          <template v-if-else="type === 'excel'">
            <div></div>
          </template>
        </div>
        <div class="card-content has-text-centered">
          <p>{{ filePath }}</p>
        </div>
      </div>
    </div>
    <button ref="btnClose"
            class="modal-close is-large"
            aria-label="close"
            autofocus
            @click="$emit('close');"
            @keyup.esc="$emit('close');" />
  </div>
</template>

<script>
const path = require('path')
const sharp = require('sharp')

export default {
  props: {
    filePath: {
      type: String
    },
    type: {
      type: String,
      Default: 'image' // design
    }
  },

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

      switch (this.type) {
        case 'design':
          // TODO: Load design preview
          break
        case 'excel':
          // TODO: load excel data preview
          break
        case 'image':
          if (ext.indexOf('tif') !== -1) {
            const imgOutputPath = path.join(global.__paths.tmp, 'preview.png')
            sharp(val)
              .png()
              .toFile(imgOutputPath)
              .then(() => {
                this.filePathData = imgOutputPath
              })
          } else {
            this.filePathData = this.filePath
          }
        // eslint-disable-next-line
        default:
          break
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
