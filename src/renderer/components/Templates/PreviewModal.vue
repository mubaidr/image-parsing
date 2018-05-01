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
        <template v-else-if="fileType === 'design'">
          <canvas ref="previewCanvas"></canvas>
        </template>
        <template v-else-if="fileType === 'excel'">
          <div>
            <table>

              <head></head>

              <body>
                <tr v-for="(row, rowIndex) in excelData"
                    :key="rowIndex">
                  <td v-for="(col, colIndex) in row"
                      :key="colIndex">
                    {{col}}
                  </td>
                </tr>
              </body>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
const Excel = require('exceljs')
const Sharp = require('sharp')
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
      excelData: [],
      canvas: null
    }
  },

  watch: {
    filePath(val) {
      if (!val) {
        this.filePathData = null
        return
      }

      // reset data
      this.resetData()

      const dotIndex = val.lastIndexOf('.')
      const ext = val.substring(dotIndex + 1).toLowerCase()

      if (this.fileType === 'design') {
        // design files preview
        this.canvas = new fabric.Canvas(this.$refs.previewCanvas, {
          backgroundColor: 'white'
        })
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
      } else if (this.fileType === 'image') {
        // image files preview
        if (ext.indexOf('tif') !== -1) {
          const imgOutputPath = path.join(global.__paths.tmp, 'preview.png')
          Sharp(val)
            .png()
            .toFile(imgOutputPath)
            .then(() => {
              this.filePathData = imgOutputPath
            })
        } else {
          this.filePathData = this.filePath
        }
      } else if (this.fileType === 'excel') {
        // excel files preview
        if (ext === 'csv') {
          fs.readFile(this.filePath, (err, data) => {
            const rows = data.toString().split('\n')
            const maxRows = Math.min(rows.length, 10)
            for (let i = 0; i < maxRows; i += 1) {
              this.excelData.push(rows[i].split(','))
            }
          })
        } else {
          const sampleData = []
          const workbook = new Excel.Workbook()
          workbook.xlsx.readFile(this.filePath).then(() => {
            // use workbook
            workbook.worksheets.forEach(sheet => {
              const maxRows = Math.min(sheet.actualRowCount, 10)
              for (let i = 0; i < maxRows; i += 1) {
                this.excelData.push(sheet.getRow(i).values)
              }
            })
          })
        }
      }
    }
  },

  methods: {
    resetData() {
      this.filePathData = null
      this.excelData = []
      this.canvas ? this.canvas.dispose() : (this.canvas = null) //eslint-disable-line
    }
  },

  mounted() {}
}
</script>

<style>

</style>
