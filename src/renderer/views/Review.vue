<template>
  <div class="section">
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
                <i v-if="sortOrder === 'asc'" class="material-icons has-pointer"
                  >arrow_drop_up</i
                >
                <i v-else class="material-icons has-pointer">arrow_drop_down</i>
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
                <span>Export Results</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </nav>

    <!-- Data list -->
    <transition mode="out-in" name="slide-up">
      <!-- Show table when data is loaded -->
      <div key="table" v-if="hasResults">
        <div class="scroll-container">
          <table class="table is-bordered is-condense">
            <tbody>
              <!-- TODO: finish table render -->
              <tr for="result in filteredResults">
                {{
                  result
                }}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Show message when no data is loaded -->
      <div key="message" v-else>
        <article class="message is-info">
          <div class="message-body">No data found.</div>
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
import { mapState, mapActions } from 'vuex'
import { saveFile } from '../../utilities/electron-dialog'
import { exportJsonToExcel } from '../../utilities/excel'
import { convertImage } from '../../utilities/images'
import KeyNativeEnum from '../../utilities/@enums/KeyNativeEnum'

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
    }
  },

  computed: {
    ...mapState(['compiledResult']),

    hasResults() {
      return this.compiledResult.getResultCount() > 0
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
        filteredCompiledResult.sort()
      } else {
        filteredCompiledResult.reverse()
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

  beforeDestroy() {
    this.clearCompiledResult()
  },

  methods: {
    ...mapActions(['clearCompiledResult']),

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
  },
}
</script>

<style lang="scss" scoped>
.scroll-container {
  width: 100%;
  min-height: 296px;
  max-height: calc(100vh - 110px);
  overflow: auto;
}

table.has-text-centered {
  font-size: small;

  th,
  td {
    text-align: left;
    vertical-align: middle;
  }
}
</style>
