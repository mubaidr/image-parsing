<template>
  <div class="section">
    <h1 class="title is-4">Compile</h1>
    <h2 class="subtitle is-6">Compile result using extracted results and answer key.</h2>

    <form class="control">
      <div class="field">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              :disabled="running"
              @click="chooseResultFile"
              class="file-input"
              name="resume"
            />
            <span class="file-cta">
              <i class="material-icons">list</i>
              <span class="file-label">Choose result File</span>
            </span>
            <span class="file-name">{{ resultFilePath }}</span>
          </label>
        </div>
        <p class="help">Choose the result file</p>
      </div>

      <div class="field">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              :disabled="running"
              @click="chooseKeyFile"
              class="file-input"
              name="resume"
            />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose Key File</span>
            </span>
            <span class="file-name">{{ keyFilePath }}</span>
          </label>
        </div>
        <p class="help">Choose the key file</p>
      </div>

      <div class="columns is-multiline">
        <div class="column is-6">
          <div class="field">
            <label class="label">Correct Marks</label>
            <div class="control">
              <input
                class="input"
                placeholder="Marks earned for each correct answer"
                v-model="correctMarks"
                type="number"
              >
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="field">
            <label class="label">Negative Marks</label>
            <div class="control">
              <input
                class="input"
                placeholder="Marks deducted for each incorrect answer"
                step="0.01"
                v-model="incorrectMarks"
                type="number"
              >
            </div>
          </div>
        </div>
      </div>

      <br>

      <div class="buttons">
        <button
          :disabled="running || !inputIsValid"
          @click="compile"
          class="button is-primary"
        >
          <i class="material-icons">assessment</i>
          <span>Compile Result</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
const { home } = require('../../utilities/data-paths.js')
const { compileResult } = require('../../utilities/compile')
const { exportJSONtoExcel } = require('../../utilities/excel')
const { NATIVE_KEYS, KEY } = require('../../utilities/valid-types.js')

// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

export default {
  data() {
    return {
      resultFilePath:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\result-output.xlsx',
      keyFilePath: 'D:\\Current\\image-parsing\\__tests__\\test-data\\key.jpg',
      correctMarks: 3,
      incorrectMarks: 1,
      running: false,
    }
  },

  computed: {
    inputIsValid() {
      return (
        this.resultFilePath &&
        this.keyFilePath &&
        this.correctMarks &&
        this.incorrectMarks
      )
    },
  },

  methods: {
    async compile() {
      this.running = true

      const res = await compileResult(this.resultFilePath, this.keyFilePath, {
        correctMarks: this.correctMarks,
        incorrectMarks: this.incorrectMarks,
      })

      if (res.length === 0) {
        this.$toasted.show('Compiled result does not contian any data. ', {
          type: 'error',
        })
      } else {
        this.exportCompiledResults(res)
        this.running = false
      }
    },

    exportCompiledResults(json) {
      dialog.showSaveDialog(
        getCurrentWindow(),
        {
          title: 'Choose destination for compiled result file',
          defaultPath: home,
          properties: ['saveFile'],
          filters: [
            {
              name: 'Excel File',
              extensions: NATIVE_KEYS,
            },
          ],
        },
        dir => {
          if (dir)
            exportJSONtoExcel(json, dir).then(() => {
              this.$toasted.show('File saved succesfully. ')
            })
        }
      )
    },

    chooseResultFile() {
      const dir = dialog.showOpenDialog(getCurrentWindow(), {
        title: 'Choose result file',
        defaultPath: this.resultFilePath,
        properties: ['openFile'],
        filters: [
          {
            name: 'Excel File',
            extensions: NATIVE_KEYS,
          },
        ],
      })

      this.resultFilePath = dir ? dir[0] : null
    },

    chooseKeyFile() {
      const dir = dialog.showOpenDialog(getCurrentWindow(), {
        title: 'Choose key file',
        defaultPath: this.keyFilePath,
        properties: ['openFile'],
        filters: [
          {
            name: 'Excel or Image File',
            extensions: KEY,
          },
        ],
      })

      this.keyFilePath = dir ? dir[0] : null
    },
  },
}
</script>

<style></style>
