<template>
  <div class="box">
    <template v-if="fileType === 'image'">
      <figure class="image">
        <img 
          :src="filePathData" 
          alt="Loading preview...">
      </figure>
    </template>
    <template v-else-if="fileType === 'design'">
      <template v-if="fileExtension === 'json'">
        <canvas 
          ref="previewCanvas" 
          width="1240" 
          height="1754" />
      </template>
      <template v-else-if="fileExtension === 'svg'">
        <img 
          :src="filePathData" 
          alt="Loading preview...">
      </template>
    </template>
    <template v-else-if="fileType === 'excel'">
      <div>
        <table>

          <head/>

          <body>
            <tr 
              v-for="(row, rowIndex) in excelData" 
              :key="rowIndex">
              <td 
                v-for="(col, colIndex) in row" 
                :key="colIndex">
                {{ col }}
              </td>
            </tr>
          </body>
        </table>
      </div>
    </template>
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
      type: String,
      default: '',
    },

    fileType: {
      type: String,
      default: 'image', // design
    },
  },

  data() {
    return {
      filePathData: null,
      fileExtension: null,
      excelData: [],
      canvas: null,
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
      const ext = (this.fileExtension = val
        .substring(dotIndex + 1)
        .toLowerCase())

      if (this.fileType === 'design') {
        // design files preview
        this.canvas = new fabric.Canvas(this.$refs.previewCanvas, {
          backgroundColor: 'white',
        })
        setTimeout(() => {
          switch (ext) {
            case 'svg':
              this.filePathData = this.filePath
              /*
              fabric.loadSVGFromURL(this.filePath, (objects, options) => {
                this.canvas.setWidth(options.width)
                this.canvas.setHeight(options.height)

                objects.forEach(obj => {
                  this.canvas.add(obj)
                  // obj.setCoords()
                })
                // this.canvas.calcOffset()
                this.canvas.renderAll()
              })
              */
              break
            case 'json':
            default:
              fabric.loadFromJSON(
                JSON.parse(fs.readFileSync(this.filePath)),
                (objects, options) => {
                  this.canvas.setWidth(options.width)
                  this.canvas.setHeight(options.height)

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
    },
  },

  mounted() {},

  methods: {
    resetData() {
      this.filePathData = null
      this.excelData = []
      this.canvas ? this.canvas.dispose() : (this.canvas = null) //eslint-disable-line
    },
  },
}
</script>

<style>
</style>
