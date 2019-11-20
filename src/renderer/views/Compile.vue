<template>
  <div class="section">
    <h1 class="title is-4">
      Compile
    </h1>
    <h2 class="subtitle is-6">
      Compile result using extracted results and answer key.
    </h2>

    <form class="control">
      <div class="field">
        <label class="label">Result File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              class="file-input"
              name="resume"
              @click.stop.prevent="chooseResultFile"
            />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ resultPath }}</span>
          </label>
        </div>
        <!-- <p class="help">
          Choose the result file
        </p> -->
      </div>

      <div class="field">
        <label class="label">Key File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              class="file-input"
              name="resume"
              @click.stop.prevent="chooseKeyFile"
            />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ keyPath }}</span>
          </label>
        </div>
        <!-- <p class="help">
          Choose the key file
        </p> -->
      </div>

      <div class="field is-grouped">
        <div class="control">
          <label class="label">Correct Marks</label>
          <input
            v-model="correctMarks"
            class="input"
            placeholder="Marks earned for each correct answer"
            type="number"
            min="1"
            max="5"
            step="1"
          />
        </div>
        <div class="control">
          <label class="label">Negative Marks</label>
          <input
            v-model="incorrectMarks"
            class="input"
            placeholder="Marks deducted for each incorrect answer"
            type="number"
            min="1"
            max="5"
            step="1"
          />
        </div>
      </div>

      <br />

      <div class="buttons">
        <button
          :disabled="!inputIsValid || isRunning"
          class="button is-light"
          @click.stop.prevent="startCompile"
        >
          <i class="material-icons">play_arrow</i>
          <span>Compile Result</span>
        </button>

        <button
          :disabled="isStopped"
          class="button is-light"
          @click.stop.prevent="stopCompile"
        >
          <i class="material-icons">stop</i>
          <span>Stop</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { openFile, saveFile } from '../../utilities/electron-dialog'
  import { exportJsonToExcel } from '../../utilities/excel'
  import KeyNativeEnum from '../../utilities/@enums/KeyNativeEnum'
  import WorkerManagerCompile from '../../utilities/@classes/WorkerManagerCompile'
  import ProgressStateEnum from '../../utilities/@enums/ProgressStateEnum'

  const workerManager = new WorkerManagerCompile()

  export default {
    data() {
      return {
        resultPath: 'D:\\Current\\image-parsing\\__tests__\\_data\\result.xlsx',
        keyPath: 'D:\\Current\\image-parsing\\__tests__\\_data\\key.xlsx',
        correctMarks: 3,
        incorrectMarks: 1,
        progressState: ProgressStateEnum.STOPPED,
      }
    },

    computed: {
      inputIsValid() {
        return (
          this.resultPath !== null &&
          this.keyPath !== null &&
          this.correctMarks !== null &&
          this.incorrectMarks !== null
        )
      },

      isRunning() {
        return this.progressState === ProgressStateEnum.RUNNING
      },

      isStopped() {
        return this.progressState === ProgressStateEnum.STOPPED
      },
    },

    unmounted() {
      workerManager.stop()
    },

    methods: {
      chooseResultFile() {
        openFile([
          {
            name: 'Excel File',
            extensions: Object.keys(KeyNativeEnum),
          },
        ]).then(file => {
          this.resultPath = file
        })
      },

      chooseKeyFile() {
        openFile([
          {
            name: 'Excel or Image File',
            extensions: Object.keys(KeyNativeEnum),
          },
        ]).then(file => {
          this.keyPath = file
        })
      },

      startCompile() {
        this.progressState = ProgressStateEnum.RUNNING

        workerManager.process({
          callbacks: {
            onsuccess(msg) {
              saveFile([
                {
                  name: 'Excel File',
                  extensions: Object.keys(KeyNativeEnum).reverse(),
                },
              ]).then(destination => {
                if (!destination) return

                exportJsonToExcel(msg.results, destination)

                this.$toasted.show('File saved succesfully. ', {
                  icon: 'check_circle',
                  type: 'success',
                })
              })

              this.progressState = ProgressStateEnum.STOPPED
            },
            onerror(msg) {
              console.error(msg)

              this.$toasted.show('Failed to save file. ', {
                icon: 'cross',
                type: 'error',
              })

              this.progressState = ProgressStateEnum.STOPPED
            },
            onprogress(msg) {
              console.info(msg)
            },
          },
          data: {
            resultPath: this.resultPath,
            keyPath: this.keyPath,
            correctMarks: this.correctMarks,
            incorrectMarks: this.incorrectMarks,
          },
        })
      },

      stopCompile() {
        workerManager.stop()
        this.progressState = ProgressStateEnum.STOPPED
      },
    },
  }
</script>

<style></style>
