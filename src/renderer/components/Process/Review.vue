<template>
  <div>
    <!-- toolbar -->
    <nav class="level is-mobile">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <p class="control">
            <button
              @click="toggleSortOrder"
              class="button is-info is-small"
            >
              Sort &nbsp;
              <i
                v-if="sortOrder === 'asc'"
                class="material-icons has-pointer"
              >arrow_drop_up</i>
              <i
                v-else
                class="material-icons has-pointer"
              >arrow_drop_down</i>
            </button>
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <input
              class="input is-info is-small"
              placeholder="Filter"
              v-model="filterQuery"
              type="text"
            >
          </p>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <p class="level-item">
          <a
            @click="analyzeResult"
            class="button is-info is-small"
          >Analyze</a>
        </p>
        <p class="level-item">
          <a
            @click="exportResult"
            class="button is-info is-small"
          >Export</a>
        </p>
        <p class="level-item">
          <a
            @click="compileResult"
            class="button is-success is-small"
          >Compile Results</a>
        </p>
      </div>
    </nav>

    <!-- Data list -->
    <div class="scroll-container">
      <table class="table is-hoverable is-narrow has-text-centered">
        <thead>
          <tr>
            <th
              :key="column"
              v-for="column in columns"
            >{{column}}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :key="result.id"
            v-for="(result, index) in filteredResults"
            v-on:dblclick="selectRow(index)"
          >
            <template v-for="([column, value]) in Object.entries(result)">
              <td
                :key="result.id + '-' +column"
                v-if="columns.includes(column)"
              >
                <template v-if="column === 'rollNo' && !result.hasValidRollNo">
                  <i
                    @click="selectRow(index)"
                    class="material-icons has-text-warning has-pointer"
                  >error_outline</i>
                  {{result.rollNo}}
                </template>
                <template v-else>{{value}}</template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Preview component -->
    <Transition
      mode="out-in"
      name="slide-up"
    >
      <modal-preview
        :image-source="imageSource"
        :selected-row="selectedRow"
        @close-modal="unSelectRow"
        @next="selectNextRow"
        @previous="selectPreviousRow"
        v-if="selectedRow"
      />
    </Transition>
    <!-- {{results}} -->
  </div>
</template>

<script>
import modalPreview from './_modal-preview.vue'

const { convertImage } = require('../../../utilities/images.js')

export default {
  name: 'ReviewResult',

  components: {
    modalPreview,
  },

  props: {
    results: {
      type: Array,
      default: () => {
        return []
      },
    },
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
    selectedRow() {
      if (this.selectedIndex !== null && this.filteredResults.length > 0)
        return this.filteredResults[this.selectedIndex]

      return null
    },

    filteredResults() {
      return this.results
        .filter(r => {
          if (!this.filterQuery) return true

          return r.rollNo ? r.rollNo.indexOf(this.filterQuery) > -1 : false
        })
        .sort((a, b) => {
          return this.sortOrder === 'asc'
            ? a.rollNo - b.rollNo
            : b.rollNo - a.rollNo
        })
    },

    columns() {
      return Object.keys(this.results[0]).map(col => col)
    },
  },

  watch: {
    async selectedRow(row) {
      if (row) {
        await convertImage(row.img).then(src => {
          this.imageSource = src
        })
      } else {
        this.imageSource = ''
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

    analyzeResult() {
      // TODO analyze results
    },

    compileResult() {
      // TODO compile results
    },

    exportResult() {
      // TODO export results
    },
  },
}
</script>

<style lang="sass">
.field.has-addons.spaced
  .control
    margin-right: 1em

.scroll-container
  max-width: 100%
  overflow-x: scroll

table.has-text-centered
  font-size: small
  thead
    background-color: #f0f0f0
  th, td
    text-align: center
    font-weight: normal
    // vertical-align: middle
</style>
