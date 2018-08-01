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
      // to skip question groups
      const QUESTION_PATTERN = new RegExp(/(q[1-9][0-9]?([a-d])?)/i)
      // const docDefinition = {}
      const data = await CSVToJSON(this.answerSheetPrepFile, true)
      const $ = cheerio.load(
        fs.readFileSync(path.join(dataPaths.testData, 'design.svg'), 'utf8'),
      )

      Object.entries(data).forEach(([key, cand]) => {
        // const advCode = key.substring(0, 3)
        const rollNo = key.substring(3)
        // eslint-disable-next-line
        cand['roll#'] = rollNo

        console.log(rollNo, cand)

        Object.values($('g')).forEach(group => {
          const title = (
            $(group)
              .find('title')
              .first()
              .html() || ''
          )
            .trim()
            .toLowerCase()

          const isQuestionGroup = QUESTION_PATTERN.test(title)

          if (!isQuestionGroup) {
            const text = cand[title]

            console.log(title)
            // TODO: update answer sheet design file to use variables form the asnwer sheet data
            if (text) {
              $(group).append(
                `<text x="4" y="839.47" class="st14" v:langID="1033">${text}</text>`,
              )
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
