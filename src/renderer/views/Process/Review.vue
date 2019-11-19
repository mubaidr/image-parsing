<template>
  <div class="section">
    <nav class="level is-mobile">
      <!-- Left side -->
      <div class="level-left custom">
        <div class="level-item">
          <div class="field">
            <!-- <label class="label">Choose result file for review: </label> -->
            <div :title="resultFilePath" class="file has-name is-fullwidth">
              <label class="file-label">
                <button
                  class="file-input"
                  name="resume"
                  @click.stop.prevent="chooseResultFile"
                />
                <span class="file-cta">
                  <i class="material-icons">list</i>
                  <span class="file-label">Choose File: </span>
                </span>
                <span class="file-name">{{
                  resultFilePath || 'Please choose a result file...'
                }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <div class="level-item">
          <p class="control">
            <button
              :disabled="!resultFilePath"
              class="button is-dark"
              @click.stop.prevent="saveResult"
            >
              <i class="material-icons md-18">save</i>
              <span>Save</span>
            </button>
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <button
              :disabled="!resultFilePath"
              class="button is-success"
              @click.stop.prevent="exportResult"
            >
              <i class="material-icons md-18">cloud_download</i>
              <span>Export</span>
            </button>
          </p>
        </div>
      </div>
    </nav>

    <br />

    <!-- toolbar -->
    <nav class="level is-mobile">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <div class="field">
            <div class="select is-small">
              <select v-model="showAllResults">
                <option :value="true">Show all results</option>
                <option :value="false"
                  >Show results with missing roll numbers</option
                >
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <button
                :disabled="!hasResults"
                class="button is-small"
                @click.stop.prevent="toggleSortOrder"
              >
                <span>Sort</span>
                <i v-if="sortOrder === 'asc'" class="material-icons md-18"
                  >arrow_drop_up</i
                >
                <i v-else class="material-icons md-18">arrow_drop_down</i>
              </button>
            </p>
            <p class="control">
              <input
                v-model="filterQuery"
                :disabled="!hasResults"
                class="input is-small"
                placeholder="Filter By Roll No."
                type="text"
              />
            </p>
          </div>
        </div>
      </div>
    </nav>

    <!-- Show table when data is loaded -->
    <div v-if="hasResults" key="table">
      <!-- Data display -->
      <!-- Header -->
      <div class="row header">
        <div class="col">#</div>
        <div class="col is-200">Answer Sheet Image</div>
        <div class="col is-100">Roll No</div>
        <!-- <div class="col custom-hidden">Answers</div> -->
      </div>

      <div class="scroll-parent">
        <!-- Custom table view using recycler-->
        <RecycleScroller
          :items="filteredResults"
          :item-size="24"
          class="scroll-container"
          key-field="id"
        >
          <template v-slot="{ item, index }">
            <div class="row">
              <!-- Row Index -->
              <div class="col">
                <span>
                  {{ index + 1 }}
                </span>
              </div>

              <!-- Answer sheet image -->
              <div class="col is-200">
                <a
                  v-if="item.imageFile"
                  class="custom-link"
                  @click.stop.prevent="selectRow(index)"
                >
                  <i class="material-icons md-18">open_in_new</i>
                  <span>View Image</span>
                </a>
                <span v-else>
                  Not available
                </span>
              </div>

              <!-- Status Icon & Roll No -->
              <div class="col is-100">
                <i
                  v-if="!item.rollNo"
                  class="material-icons md-18 has-text-danger"
                >
                  report_problem
                </i>
                <i
                  v-else-if="!item.isRollNoExtracted"
                  class="material-icons md-18 has-text-warning"
                >
                  priority_high
                </i>
                <i v-else class="material-icons md-18 has-text-success">
                  check
                </i>
                <span>
                  <template
                    v-if="item.isRollNoExtracted"
                    class="has-text-success"
                  >
                    {{ item.rollNo }}
                  </template>
                  <template v-else>
                    <a
                      class="custom-link"
                      @click.stop.prevent="selectRow(index)"
                    >
                      <span>Update</span>
                    </a>
                  </template>
                </span>
              </div>

              <!-- <div class="col is-size-7 custom-hidden">
                <template v-for="answer in item.answers">
                  {{ answer.value }}
                </template>
              </div> -->
            </div>
          </template>
        </RecycleScroller>
      </div>
    </div>

    <!-- Show message when no data is loaded -->
    <div v-else key="message">
      <article class="message is-light">
        <div class="message-body">
          <i class="material-icons">info</i>
          <span>Please load a result file to review, save or export.</span>
        </div>
      </article>
    </div>

    <!-- Preview component -->
    <Transition mode="out-in" name="slide-up">
      <modal-preview
        v-if="selectedRow"
        :image-source="imageSource"
        :selected-row="selectedRow"
        @close-modal="unSelectRow"
        @next="selectNextRow"
        @previous="selectPreviousRow"
      />
    </Transition>
  </div>
</template>

<script>
  import modalPreview from '../../components/ModalPreview'
  import { saveFile, openFile } from '../../../utilities/electron-dialog'
  import { exportJsonToExcel } from '../../../utilities/excel'
  import { convertImage } from '../../../utilities/images'
  import KeyNativeEnum from '../../../utilities/@enums/KeyNativeEnum'
  import CompiledResult from '../../../utilities/@classes/CompiledResult'

  export default {
    name: 'ReviewResult',

    components: {
      modalPreview,
    },

    data() {
      return {
        selectedIndex: null,
        imageSource: null,
        sortOrder: 'asc',
        filterQuery: '',
        resultFilePath: null,
        showAllResults: true,
        compiledResult: new CompiledResult(),
      }
    },

    computed: {
      hasResults() {
        return this.compiledResult.getResults().length > 0
      },

      selectedRow() {
        if (this.selectedIndex !== null && this.filteredResults.length > 0) {
          return this.filteredResults[this.selectedIndex]
        }

        return null
      },

      filteredResults() {
        let results = this.compiledResult.getResults()

        if (this.filterQuery) {
          return results.filter(r => {
            return r.rollNo && r.rollNo.toString().includes(this.filterQuery)
          })
        } else {
          if (this.showAllResults) return results

          return results.filter(r => !r.rollNo)
        }
      },
    },

    watch: {
      selectedRow(row) {
        if (row && row.imageFile) {
          convertImage(row.imageFile).then(is => {
            this.imageSource = is
          })
        } else {
          this.imageSource = null
        }
      },
    },

    created() {
      window.removeEventListener('keydown', null)
      window.addEventListener('keydown', this.handleKeyDown)

      const resultFilePath = this.$route.query.resultFilePath
      if (!resultFilePath) return

      this.resultFilePath = resultFilePath
    },

    mounted() {
      this.loadResult()
    },

    methods: {
      selectRow(index) {
        this.selectedIndex = index
      },

      unSelectRow() {
        this.selectedIndex = null
      },

      selectNextRow() {
        const nextIndex = this.selectedIndex + 1

        if (nextIndex < this.filteredResults.length) {
          this.selectedIndex = nextIndex
        } else {
          this.selectedIndex = 0
        }
      },

      selectPreviousRow() {
        const nextIndex = this.selectedIndex - 1

        if (nextIndex > -1) {
          this.selectedIndex = nextIndex
        } else {
          this.selectedIndex = this.filteredResults.length - 1
        }
      },

      toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'

        this.compiledResult.sortResults()

        if (this.sortOrder === 'desc') {
          this.compiledResult.reverseResults()
        }
      },

      handleKeyDown(e) {
        if (this.selectedIndex === null) return

        if (e.shiftKey) {
          if (e.key === 'Tab' || e.key === 'Enter') this.selectPreviousRow()

          return
        }

        switch (e.key) {
          case 'Escape':
            this.unSelectRow()
            break
          case 'Tab':
          case 'Enter':
            this.selectNextRow()
            break
          default:
            break
        }
      },

      chooseResultFile() {
        openFile([
          {
            name: 'Excel File',
            extensions: Object.keys(KeyNativeEnum),
          },
        ]).then(file => {
          if (!file) {
            this.clearResult()

            return
          }

          this.resultFilePath = file
          this.loadResult()
        })
      },

      clearResult() {
        this.compiledResult = new CompiledResult()
      },

      saveResult() {
        exportJsonToExcel(this.compiledResult, this.resultFilePath)
        this.$toasted.show('File saved succesfully. ', {
          icon: 'check_circle',
          type: 'success',
        })
      },

      exportResult() {
        saveFile([
          {
            name: 'Excel File',
            extensions: Object.keys(KeyNativeEnum).reverse(),
          },
        ]).then(destination => {
          if (!destination) return

          exportJsonToExcel(this.compiledResult, destination)
          this.$toasted.show('File saved succesfully. ', {
            icon: 'check_circle',
            type: 'success',
          })
        })
      },

      loadResult() {
        if (!this.resultFilePath) return

        this.compiledResult = CompiledResult.loadFromExcel(this.resultFilePath)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .level {
    margin-bottom: 12px;

    .level-left.custom {
      min-width: 50%;

      .field {
        width: 100%;
      }
    }
  }

  .scroll-parent {
    overflow-x: auto;
    width: 100%;
  }

  .vue-recycle-scroller.scroll-container {
    width: 100%;
    min-width: 1270px;
    height: calc(100vh - 200px);
    border-bottom: 1px solid #dbdbdb;
    overflow: auto;
  }

  .row {
    height: 27px !important;
    width: 100%;
    border: 1px solid #dbdbdb;
    border-top-color: transparent;
    font-family: monospace;
    font-size: 12px;

    * {
      vertical-align: middle;
    }

    &.header {
      border-top-color: #dbdbdb;
      font-weight: bold !important;
    }

    .col {
      display: inline-block;
      padding: 5px;
      min-width: 45px;

      &.is-50 {
        min-width: 45px;
      }

      &.is-75 {
        min-width: 75px;
      }

      &.is-100 {
        min-width: 100px;
      }

      &.is-150 {
        min-width: 150px;
      }

      &.is-200 {
        min-width: 200px;
      }
    }
  }
</style>
