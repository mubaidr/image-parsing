<template>
  <div class="section">
    <h1 class="title">Compile</h1>
    <h2 class="subtitle is-6">Comile result.</h2>
    <hr>

    <label class="subtitle is-6">Choose result file: </label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          type="file"
          name="resume"
          @click="chooseFileResult"/>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-file"/>
          </span>
          <span class="file-label">
            Choose a file…
          </span>
        </span>
        <span
          v-show="resultFile"
          class="file-name">
          {{ resultFile }}
        </span>
      </label>
    </div>

    <br>
    <label class="subtitle is-6">Choose answer key file: </label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <button
          class="file-input"
          type="file"
          name="resume"
          @click="chooseFileKey"/>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-file"/>
          </span>
          <span class="file-label">
            Choose a file…
          </span>
        </span>
        <span
          v-show="keyFile"
          class="file-name">
          {{ keyFile }}
        </span>
      </label>
    </div>

    <br>
    <label class="subtitle is-6">Options:</label>
    <p>Coming soon!</p>
    <br>

    <hr>

    <button
      :disabled="running"
      class="button is-dark"
      @click="startProcess">Start Process</button>

    <div
      :class="{'is-active': running}"
      class="modal">
      <div class="modal-background"/>
      <div class="modal-content">
        <div
          class="box">
          <h3 class="title is-5">Compiling</h3>
          <progress
            class="progress is-primary is-large"/>
        </div>
      </div>
    </div>
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
      running: false,
    }
  },

  computed: {},

  watch: {},

  methods: {
    async startProcess() {
      Promise.all([
        CSVToJSON(this.resultFile, true),
        CSVToJSON(this.keyFile, true, true),
      ]).then(([result, key]) => {
        // TODO: add inputs for obtainig marks info
        compileResult(key, result, 3, 0.33)
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

<style>
</style>
