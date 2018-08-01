<template>
  <div class="section">
    <h1 class="title">Generate</h1>
    <h2 class="subtitle">Generate Answer Sheets.</h2>
    <br>

    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          type="file"
          name="resume"
          @click="chooseAnswerSheetPrepFile"/>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-file"/>
          </span>
          <span class="file-label">
            Result file
          </span>
        </span>
        <span
          v-show="answerSheetPrepFile"
          class="file-name">
          {{ answerSheetPrepFile }}
        </span>
      </label>
    </div>

    <br>

    <button
      :disabled="!isValid"
      class="button is-dark"
      @click="generate">Generate</button>
  </div>
</template>

<script>
import { CSVToJSON } from '../../utilities'

// const pdfmake = require('pdfmake')
const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
// eslint-disable-next-line
const { remote } = require('electron')

const dataPaths = require('../../utilities/data-paths.js')

export default {
  data() {
    return {
      answerSheetPrepFile:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\answerSheetPrep.csv',
    }
  },

  computed: {
    isValid() {
      return this.answerSheetPrepFile !== null
    },
  },

  methods: {
    chooseAnswerSheetPrepFile() {
      ;[this.answerSheetPrepFile] = remote.dialog.showOpenDialog({
        properties: ['openFile'],
      }) || [false]
    },

    async generate() {
      // const docDefinition = {}
      const data = await CSVToJSON(this.answerSheetPrepFile, true)
      const $ = cheerio.load(
        fs.readFileSync(path.join(dataPaths.testData, 'design.svg'), 'utf8'),
      )

      Object.entries(data).forEach(([key, val]) => {
        // const advCode = key.substring(0, 3)
        // const rollNo = key.substring(3)

        // console.log(advCode, rollNo, val)

        Object.values($('g')).forEach(group => {
          const title = $(group)
            .find('title')
            .first()
            .html()

          // console.log(title)

          if (title) {
            switch (title.trim().toLowerCase()) {
              case 'rollnobarcode':
                console.log(group)
                break
              default:
                break
            }
          }
        })
      })

      document.body.innerHTML += $.html()

      // console.log('doc : ', docDefinition)
      // pdfmake.createPdf(docDefinition).download()
    },
  },
}
</script>

<style>
</style>
