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
              <i class="material-icons">sort</i>
              <span>&nbsp; Sort &nbsp;</span>
              <i
                class="material-icons has-pointer"
                v-if="sortOrder === 'asc'"
              >arrow_drop_up</i>
              <i
                class="material-icons has-pointer"
                v-else
              >arrow_drop_down</i>
            </button>
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <input
              class="input is-info is-small"
              placeholder="Filter"
              type="text"
              v-model="filterQuery"
            >
          </p>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <p class="level-item">
          <a
            @click="importResult"
            class="button is-info is-small"
          >
            <i class="material-icons">cloud_upload</i> &nbsp; Import
          </a>
        </p>
        <p class="level-item">
          <a
            @click="analyzeResult"
            class="button is-info is-small"
          >
            <i class="material-icons">assessment</i> &nbsp; Analyze
          </a>
        </p>
        <p class="level-item">
          <a
            @click="exportResult"
            class="button is-info is-small"
          >
            <i class="material-icons">cloud_download</i> &nbsp; Export
          </a>
        </p>
        <p class="level-item">
          <a
            @click="compileResult"
            class="button is-success is-small"
          >
            <i class="material-icons">save</i> &nbsp; Compile
          </a>
        </p>
      </div>
    </nav>
    <!-- {{filteredResults}} -->
    <!-- Data list -->
    <div class="scroll-container">
      <Transition
        mode="out-in"
        name="slide-up"
      >
        <template v-if="filteredResults.length !== 0">
          <table class="table is-hoverable is-narrow has-text-centered">
            <thead>
              <tr>
                <th>#</th>
                <th
                  :key="column.label"
                  v-for="column in columns"
                >{{column.title}}</th>
              </tr>
            </thead>
            <tbody
              is="transition-group"
              mode="out-in"
              name="slide-left"
            >
              <tr
                :key="result.id"
                v-for="(result, index) in filteredResults"
                v-on:dblclick="selectRow(index)"
              >
                <td>{{index + 1}}</td>
                <template v-for="([column, value]) in Object.entries(result)">
                  <td
                    :class="{'has-background-danger': !result.hasValidRollNo && column ==='rollNo'}"
                    :key="result.id + '-' + column"
                    v-if="columns[column]"
                  >{{value}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <!-- TODO: add notification message -->
          no data found
        </template>
      </Transition>
    </div>
    <!-- TODO: add pagination -->
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
    <!-- {{columns}} -->
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
      // rename and hide columns
      const columns = {}
      const hiddenColumns = ['id', 'img', 'hasValidRollNo']
      const renameColumns = {
        rollNo: 'Roll #',
      }

      Object.keys(this.results[0])
        .filter(col => hiddenColumns.indexOf(col) === -1)
        .forEach(col => {
          columns[col] = {
            title: renameColumns[col] || col,
            label: col,
          }
        })

      return columns
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

    importResult() {
      // TODO import results
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
  overflow-x: auto

table.has-text-centered
  .has-background-danger
    color: #fff
  thead
    background-color: #f0f0f0
  th, td
    text-align: left
    font-weight: normal
    vertical-align: middle

.wide-column
  min-width: 200px
</style>
