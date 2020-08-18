<template>
  <div class="section">
    <h1 class="title is-4">
      Train Network
    </h1>

    <form class="control">
      <div class="field">
        <label class="label">Design File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              class="file-input"
              name="resume"
              @click="chooseDesignPath"
            />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ designPath }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">Result File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button
              class="file-input"
              name="resume"
              @click="chooseResultPath"
            />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ resultPath }}</span>
          </label>
        </div>
      </div>

      <div class="field">
        <label class="label">Key File</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <button class="file-input" name="resume" @click="choosekeyPath" />
            <span class="file-cta">
              <i class="material-icons">insert_drive_file</i>
              <span class="file-label">Choose File</span>
            </span>
            <span class="file-name">{{ keyPath }}</span>
          </label>
        </div>
      </div>

      <br />

      <div class="buttons">
        <button
          :disabled="!inputIsValid"
          class="button is-light"
          @click="start"
        >
          <i class="material-icons">play_arrow</i>
          <span>Train</span>
        </button>

        <button :disabled="isRunning" class="button is-default" @click="stop">
          <i class="material-icons">stop</i>
          <span>Stop</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { openFile } from '../../../utilities/electron-dialog'
  import ImageTypesEnum from '../../../utilities/@enums/ImageTypesEnum'
  import KeyNativeEnum from '../../../utilities/@enums/KeyNativeEnum'
  import WorkerManagerTrain from '../../../utilities/@classes/WorkerManagerTrain'
  import ProgressStateEnum from '../../../utilities/@enums/ProgressStateEnum'

  let workerManager = new WorkerManagerTrain()

  export default {
    data() {
      return {
        designPath: 'D:\\Current\\image-parsing\\__tests__\\_data\\design.svg',
        resultPath: 'D:\\Current\\image-parsing\\__tests__\\_data\\key.xlsx',
        keyPath: 'D:\\Current\\image-parsing\\__tests__\\_data\\key.jpg',
        logs: [],
        progressState: ProgressStateEnum.STOPPED,
      }
    },

    computed: {
      inputIsValid() {
        return (
          this.designPath !== null &&
          this.resultPath !== null &&
          this.keyPath !== null
        )
      },

      isRunning() {
        return this.progressState === ProgressStateEnum.RUNNING
      },
    },

    unmounted() {
      workerManager.stop()
    },

    methods: {
      start() {
        this.progressState === ProgressStateEnum.RUNNING

        workerManager.process({
          callbacks: {
            onsuccess: msg => {
              this.progressState === ProgressStateEnum.STOPPED

              this.$toasted.show(
                `Successfully trained in ${msg.data.iterations} iterations`,
                {
                  type: 'success',
                  icon: 'info',
                }
              )

              this.stop()
            },
            onerror: msg => {
              this.progressState === ProgressStateEnum.STOPPED

              this.$toasted.show(msg.error, {
                type: 'error',
                icon: 'info',
              })
            },
          },
          data: {
            designPath: this.designPath,
            resultPath: this.resultPath,
            keyPath: this.keyPath,
          },
        })
      },

      stop() {
        workerManager.stop()

        this.progressState === ProgressStateEnum.STOPPED
      },

      chooseDesignPath() {
        openFile([
          {
            name: 'SVG File',
            extensions: ['.svg'],
          },
        ]).then(file => {
          this.designPath = file
        })
      },

      chooseResultPath() {
        openFile([
          {
            name: 'Excel File',
            extensions: Object.keys(KeyNativeEnum),
          },
        ]).then(file => {
          this.resultPath = file
        })
      },

      choosekeyPath() {
        openFile([
          {
            name: 'Image File',
            extensions: Object.keys(ImageTypesEnum),
          },
        ]).then(file => {
          this.keyPath = file
        })
      },
    },
  }
</script>

<style></style>
