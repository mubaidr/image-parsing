<template>
  <div>
    <div class="card">
      <div class="card-image">
        <template v-if="fileType === 'image'">
          <figure class="image">
            <img :src="filePathData"
                 alt="Preview Image">
          </figure>
        </template>
        <template v-if-else="fileType === 'design'">
          <canvas ref="previewCanvas"></canvas>
        </template>
        <template v-if-else="fileType === 'excel'">
          <div></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
const exceljs = require('exceljs')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

export default {
  props: {
    filePath: {
      type: String
    },
    fileType: {
      type: String,
      Default: 'image' // design
    },
    isFile: {
      type: Boolean,
      Default: false
    }
  },

  data() {
    return {
      filePathData: null,
      canvas: null
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

      switch (this.fileType) {
        case 'design':
          setTimeout(() => {
            switch (ext) {
              case 'svg':
                fabric.loadSVGFromURL(this.filePath, (objects, options) => {
                  const obj = fabric.util.groupSVGElements(objects, options)
                  this.canvas.add(obj).centerObject(obj)
                  obj.setCoords()
                  this.canvas.calcOffset()
                  this.canvas.renderAll()
                })
                break
              case 'json':
              default:
                fabric.loadFromJSON(
                  JSON.parse(fs.readFileSync(this.filePath)),
                  (objects, options) => {
                    const obj = fabric.util.groupSVGElements(objects, options)
                    this.canvas.add(obj).centerObject(obj)
                    obj.setCoords()
                    this.canvas.calcOffset()
                    this.canvas.renderAll()
                  }
                )
                break
            }
          }, 250)
          break
        case 'excel':
          console.log(exceljs)
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
    }
  },

  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.previewCanvas, {
      backgroundColor: 'white'
    })
  }
}
</script>

<style>

</style>
