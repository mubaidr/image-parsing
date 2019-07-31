<template>
  <div class="section">
    <nav class="level is-mobile">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <div class="field">
            <!-- <label class="label">Choose result file for review: </label> -->
            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <button
                  @click="chooseResultFile"
                  class="file-input"
                  name="resume"
                />
                <span class="file-cta">
                  <i class="material-icons">list</i>
                  <span class="file-label"
                    >Choose result file to load for review:
                  </span>
                </span>
                <span class="file-name">{{
                  resultFilePath || 'Please choose a excel file...'
                }}</span>
              </label>
            </div>
          </div>
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
                <p class="control has-icons-right">
                  <input
                    :disabled="!hasResults"
                    v-model="filterQuery"
                    class="input is-small"
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
              <p class="control">
                <button class="button is-success is-small">
                  <i class="material-icons md-18">save</i>
                  <span>Save</span>
                </button>
              </p>
            </div>
            <div class="level-item">
              <p class="control">
                <button
                  :disabled="!hasResults"
                  @click="exportResult"
                  class="button is-success is-small"
                >
                  <i class="material-icons md-18">cloud_download</i>
                  <span>Export</span>
                </button>
              </p>
            </div>
          </div>
        </nav>

        <!-- Data display -->
        <!-- Header -->
        <div class="row header">
          <div class="col is-1">#</div>
          <div class="col is-2">Roll No</div>
          <div class="col is-2">Image</div>
        </div>

        <!-- Custom table view using recycler-->
        <RecycleScroller
          :items="filteredResults"
          :item-size="24"
          class="scroll-container"
          key-field="id"
        >
          <template v-slot="{ item, index }">
            <div class="row">
              <div class="col is-1">{{ index + 1 }}</div>
              <div class="col is-2">
                <i v-if="item.rollNo" class="material-icons has-text-success">
                  check
                </i>
                <i v-else class="material-icons has-text-danger">
                  info
                </i>
                <span>
                  {{ item.rollNo }}
                </span>
              </div>
              <div class="col is-3">
                <button
                  :disabled="!item.imageFile"
                  @click="selectRow(index)"
                  class="button is-default is-small custom-link"
                >
                  <i class="material-icons">open_in_new</i>
                  <span v-if="item.rollNo">View</span>
                  <span v-else>View & Enter Roll No</span>
                </button>
              </div>
            </div>
          </template>
        </RecycleScroller>
      </div>

      <!-- Show message when no data is loaded -->
      <div key="message" v-else>
        <article class="message is-light">
          <div class="message-body">
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
      // TODO: fix sorting
      const filteredCompiledResult = this.compiledResult
        .getResults()
        .filter(r => {
          if (!this.filterQuery) return true

          return r.rollNo && r.rollNo.toString().includes(this.filterQuery)
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

  mounted() {
    const resultFilePath =
      this.$route.query.resultFilePath ||
      'D:\\Current\\image-parsing\\__tests__\\test-data\\result.xlsx'

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
      if (this.sortOrder === 'asc') this.sortOrder = 'desc'
      else this.sortOrder = 'asc'
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

    chooseResultFile() {
      openFile([
        {
          name: 'Excel File',
          extensions: Object.keys(KeyNativeEnum),
        },
      ]).then(file => {
        if (!file) return

        this.resultFilePath = file
        this.loadResult()
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
}

.vue-recycle-scroller.scroll-container {
  width: 100%;
  height: calc(100vh - 190px);
  border-bottom: 1px solid #dbdbdb;
  overflow: auto;

  .material-icons {
    font-size: 24px;
  }
}

.row {
  height: 24px;
  width: 100%;
  border: 1px solid #dbdbdb;
  border-top-color: transparent;
  overflow: hidden;

  &.header {
    border-top-color: #dbdbdb;
    font-weight: bold;
  }

  .col {
    display: inline-block;
    padding: 0 0.5em;
    height: 24px !important;

    &.is-1 {
      width: 10%;
    }
    &.is-2 {
      width: 20%;
    }
    &.is-3 {
      width: 30%;
    }
    &.is-4 {
      width: 40%;
    }
    &.is-5 {
      width: 50%;
    }
    &.is-6 {
      width: 60%;
    }
    &.is-7 {
      width: 70%;
    }
    &.is-8 {
      width: 80%;
    }
    &.is-9 {
      width: 90%;
    }
    &.is-10 {
      width: 100%;
    }
  }
}
</style>
