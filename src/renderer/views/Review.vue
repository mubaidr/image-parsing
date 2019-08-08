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
                  @click="chooseResultFile"
                  class="file-input"
                  name="resume"
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
              @click="saveResult"
              :disabled="!resultFilePath"
              class="button is-dark"
            >
              <i class="material-icons md-18">save</i>
              <span>Save</span>
            </button>
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <button
              @click="exportResult"
              :disabled="!resultFilePath"
              class="button is-success"
            >
              <i class="material-icons md-18">cloud_download</i>
              <span>Export</span>
            </button>
          </p>
        </div>
      </div>
    </nav>

    <br />

    <!-- Data list -->
    <transition mode="out-in" name="slide-up">
      <!-- Show table when data is loaded -->
      <div key="table" v-if="hasResults">
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
                    @click="toggleSortOrder"
                    class="button is-small"
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
                    :disabled="!hasResults"
                    v-model="filterQuery"
                    class="input is-small"
                    placeholder="Filter By Roll No."
                    type="text"
                  />
                </p>
              </div>
            </div>
          </div>
        </nav>

        <!-- Data display -->
        <!-- Header -->
        <div class="row header">
          <div class="col">#</div>
          <div class="col"></div>
          <div class="col is-100">Roll No</div>
          <div class="col is-200">Answer Sheet Image</div>
          <div class="col custom-hidden">Answers</div>
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
                <!-- Status Icon -->
                <div class="col">
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
                </div>
                <!-- Roll No -->
                <div class="col is-100">
                  <span>
                    {{ item.rollNo }}
                  </span>
                </div>
                <!-- Answer sheet image -->
                <div class="col is-200">
                  <a
                    @click="selectRow(index)"
                    v-if="item.imageFile"
                    class="custom-link"
                  >
                    <i class="material-icons md-18">open_in_new</i>
                    <span v-if="item.isRollNoExtracted">View</span>
                    <span v-else>Update Roll No</span>
                  </a>
                  <span v-else>
                    Not available
                  </span>
                </div>
                <div class="col is-size-7 custom-hidden">
                  <template v-for="answer in item.answers">
                    {{ answer.value }}
                  </template>
                </div>
              </div>
            </template>
          </RecycleScroller>
        </div>
      </div>

      <!-- Show message when no data is loaded -->
      <div key="message" v-else>
        <article class="message is-light">
          <div class="message-body">
            <i class="material-icons">info</i>
            <span>Please load a result file to review, save or export.</span>
          </div>
        </article>
      </div>
    </transition>

    <!-- Preview component -->
    <Transition mode="out-in" name="slide-up">
      <modal-preview
        :image-source="imageSource"
        :selected-row="selectedRow"
        @close-modal="unSelectRow"
        @next="selectNextRow"
        @previous="selectPreviousRow"
        v-if="selectedRow"
      />
    </Transition>
  </div>
</template>

<script>
import modalPreview from '../components/ModalPreview'
import { saveFile, openFile } from '../../utilities/electron-dialog'
import { exportJsonToExcel } from '../../utilities/excel'
import { convertImage } from '../../utilities/images'
import KeyNativeEnum from '../../utilities/@enums/KeyNativeEnum'
import CompiledResult from '../../utilities/@classes/CompiledResult'

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
  },

  mounted() {
    const resultFilePath = this.$route.query.resultFilePath

    if (!resultFilePath) return

    this.resultFilePath = resultFilePath
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
  height: 24px !important;
  width: 100%;
  border: 1px solid #dbdbdb;
  border-top-color: transparent;
  font-family: monospace;

  * {
    vertical-align: middle;
  }

  &.header {
    border-top-color: #dbdbdb;
    font-weight: bold;
  }

  .col {
    display: inline-block;
    padding: 0 0.5em;
    min-width: 25px;

    &.is-50 {
      min-width: 50px;
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
