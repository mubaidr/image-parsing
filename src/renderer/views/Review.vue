<template>
  <div class="section">
    <!-- toolbar -->
    <div class="columns">
      <div class="column is-6">
        <div class="field">
          <!-- <label class="label">Load result file for review: </label> -->
          <div class="file has-name is-fullwidth">
            <label class="file-label">
              <button
                @click="chooseResultFile"
                class="file-input"
                name="resume"
              />
              <span class="file-cta">
                <i class="material-icons">list</i>
                <span class="file-label">Choose File</span>
              </span>
              <span class="file-name">{{
                resultFilePath || 'Please choose a excel file...'
              }}</span>
            </label>
          </div>
          <p class="help">
            Choose the result file (excel) to review.
          </p>
        </div>
      </div>
      <div class="column is-2">
        <button class="button is-primary" @click="loadResult">
          <i class="material-icons">cloud_upload</i>
          <span>Import result</span>
        </button>
      </div>
    </div>

    <!-- Data list -->
    <transition mode="out-in" name="slide-up">
      <!-- Show table when data is loaded -->
      <div key="table" v-if="hasResults">
        <!-- toolbar -->
        <nav class="level is-mobile">
          <!-- Left side -->
          <div class="level-left">
            <div class="level-item">
              <div class="field has-addons">
                <p class="control">
                  <button
                    :disabled="!hasResults"
                    @click="toggleSortOrder"
                    class="button"
                  >
                    <span>Sort</span>
                    <i
                      v-if="sortOrder === 'asc'"
                      class="material-icons has-pointer"
                      >arrow_drop_up</i
                    >
                    <i v-else class="material-icons has-pointer"
                      >arrow_drop_down</i
                    >
                  </button>
                </p>
                <p class="control has-icons-right">
                  <input
                    :disabled="!hasResults"
                    v-model="filterQuery"
                    class="input"
                    placeholder="Filter By Roll No."
                    type="text"
                  />
                  <span class="icon is-right">
                    <i class="material-icons">search</i>
                  </span>
                </p>
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
                    @click="exportResult"
                    class="button is-success"
                  >
                    <i class="material-icons">save</i>
                    <span>Export</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </nav>

        <div class="scroll-container">
          <table class="table is-bordered is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>Roll No</th>
                <th>Answer Sheet</th>
                <th>Post</th>
                <th>Test Center</th>
                <th>Test Time</th>
                <th>Question Paper Type</th>
              </tr>
            </thead>
            <tbody>
              <!-- TODO: finish table render -->
              <tr v-for="(result, index) in filteredResults" :key="result.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <input
                    :class="{ 'is-danger': !result.rollNo }"
                    v-model="result.rollNo"
                    type="text"
                    class="input is-small is-fullwidth"
                  />
                </td>
                <td>
                  <button
                    @click="selectRow(index)"
                    class="button is-default is-small is-fullwidth"
                  >
                    <span class="material-icons md-18">zoom_in</span>
                    <span> View Image</span>
                  </button>
                </td>
                <td>{{ result.post }}</td>
                <td>{{ result.testCenter }}</td>
                <td>{{ result.testTime }}</td>
                <td>{{ result.questionPaperType }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Show message when no data is loaded -->
      <div key="notification" v-else>
        <br />
        <br />
        <article class="notification is-dark">
          <div class="notification-body">
            <span>
              <i class="material-icons">info</i>
              No data loaded.
            </span>
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
import { mapState, mapActions } from 'vuex'
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
      resultFilePath: '',
      compiledResult: new CompiledResult(),
    }
  },

  computed: {
    hasResults() {
      return this.filteredResults.length > 0
    },

    selectedRow() {
      if (this.selectedIndex !== null && this.filteredResults.length > 0) {
        return this.filteredResults[this.selectedIndex]
      }

      return null
    },

    filteredResults() {
      const filteredCompiledResult = this.compiledResult
        .getResults()
        .filter(r => {
          if (!this.filterQuery) return true

          return r.rollNo ? r.rollNo.indexOf(this.filterQuery) > -1 : false
        })

      if (this.sortOrder === 'asc') {
        filteredCompiledResult.sort((a, b) => {
          return parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10)
        })
      } else {
        filteredCompiledResult
          .sort((a, b) => {
            return parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10)
          })
          .reverse()
      }

      return filteredCompiledResult
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
      if (this.sortOrder === 'asc') this.sortOrder = 'desc'
      else this.sortOrder = 'asc'
    },

    handleKeyDown(e) {
      if (this.selectedIndex === null) return

      if (e.shiftKey) {
        if (e.key === 'Tab') this.selectPreviousRow()

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

    exportResult() {
      saveFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum).reverse(),
        },
      ]).then(destination => {
        if (!destination) return

        exportJsonToExcel(this.compiledResult, destination)
        this.$toasted.show('File saved succesfully. ')
      })
    },

    chooseResultFile() {
      openFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum),
        },
      ]).then(file => {
        if (!file) return

        this.resultFilePath = file
      })
    },

    loadResult() {
      this.compiledResult = CompiledResult.loadFromExcel(this.resultFilePath)
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-container {
  width: 100%;
  min-height: 296px;
  max-height: calc(100vh - 140px);
  overflow: auto;
}

table {
  font-size: small;

  th,
  td {
    text-align: left;
    vertical-align: middle;
  }

  button {
    padding: 0.25em;
  }
}
</style>
