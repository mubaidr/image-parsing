<template>
  <div class="section">
    <h1 class="title">Compile</h1>
    <h2 class="subtitle is-6">
      Compile result using extracted results and answer key.
    </h2>
    <br />

    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          type="file"
          name="resume"
          @click="chooseFileResult"
        />
        <span class="file-cta">
          <span class="file-icon"> <i class="fas fa-file" /> </span>
          <span class="file-label"> Result file </span>
        </span>
        <span v-show="resultFile" class="file-name"> {{ resultFile }} </span>
      </label>
    </div>

    <br />
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          type="file"
          name="resume"
          @click="chooseFileKey"
        />
        <span class="file-cta">
          <span class="file-icon"> <i class="fas fa-file" /> </span>
          <span class="file-label"> Key file </span>
        </span>
        <span v-show="keyFile" class="file-name"> {{ keyFile }} </span>
      </label>
    </div>

    <br />
    <div class="block">
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label"> Correct Marks </label>
            <div class="control">
              <input
                v-model="correctMarks"
                class="input"
                type="number"
                placeholder="Marks earned for each correct answer"
              />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label"> Negative Marks </label>
            <div class="control">
              <input
                v-model="incorrectMarks"
                class="input"
                type="number"
                step="0.01"
                placeholder="Marks deducted for each incorrect answer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <br />

    <button
      :disabled="running || !isValid"
      class="button is-dark"
      @click="startProcess"
    >
      Start Compilation
    </button>
  </div>
</template>

<script>
import { CSVToJSON, compileResult } from '../../utilities'

// eslint-disable-next-line
const { remote } = require('electron')

export default {
  data() {
    return {
      resultFile:
        'D:\\Current\\image-parsing\\__tests__\\test-data\\result-output.csv',
      keyFile: 'D:\\Current\\image-parsing\\__tests__\\test-data\\key.csv',
      correctMarks: 3,
      incorrectMarks: 1,
      running: false,
    }
  },

  computed: {
    isValid() {
      return (
        this.resultFile &&
        this.keyFile &&
        this.correctMarks &&
        this.incorrectMarks
      )
    },
  },

  watch: {},

  methods: {
    async startProcess() {
      Promise.all([
        CSVToJSON(this.resultFile, true),
        CSVToJSON(this.keyFile, true, true),
      ]).then(([result, key]) => {
        compileResult(key, result, this.correctMarks, this.incorrectMarks)
      })
    },

    chooseFileResult() {
      ;[this.resultFile] = remote.dialog.showOpenDialog({
        properties: ['openFile'],
      }) || [false]
    },

    chooseFileKey() {
      ;[this.keyFile] = remote.dialog.showOpenDialog({
        properties: ['openFile'],
      }) || [false]
    },
  },
}
</script>

<style></style>
