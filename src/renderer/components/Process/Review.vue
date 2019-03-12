<template>
  <div>
    <!-- toolbar -->
    <nav class="level is-mobile">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <button
                @click="toggleSortOrder"
                class="button"
              >
                <span>Sort</span>
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
            <p class="control has-icons-right">
              <input
                class="input"
                placeholder="Filter"
                v-model="filterQuery"
                type="text"
              >
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
              <a
                @click="exportResult"
                class="button is-success"
              >
                <i class="material-icons">save</i>
                <span>Export Results</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </nav>

    <!-- Data list -->
    <transition
      mode="out-in"
      name="slide-up"
    >
      <!-- Show table when data is loaded -->
      <div
        key="table"
        v-if="results.length > 0"
      >
        <div class="scroll-container">
          <table
            ref="tbl_data"
            class="table is-hoverable is-narrow has-text-centered"
          >
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
              name="list-complete"
            >
              <!-- Show table rows if data rows are available -->
              <template v-if="filteredResults.length > 0">
                <tr
                  :key="result.id"
                  v-for="(result, index) in filteredResults"
                  class="list-complete-item"
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
              </template>
              <!-- Show message if now data rows are available -->
              <template v-else>
                <tr
                  key="message-row"
                  class="list-complete-item"
                >
                  <td
                    :colspan="Object.keys(columns).length + 1"
                    class="has-text-left"
                  >
                    <span class="tag is-warning">No data found...</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Show message when no data is loaded -->
      <div
        key="message"
        v-else
      >
        <article class="message is-info">
          <div class="message-header">
            <p>Info</p>
            <button
              aria-label="delete"
              class="delete"
            ></button>
          </div>
          <div class="message-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
            <a>felis venenatis</a> efficitur. Aenean ac
            <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
          </div>
        </article>
      </div>
    </transition>
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

// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

const { home } = require('../../../utilities/data-paths.js')
const { NATIVE_KEYS } = require('../../../utilities/valid-types.js')

const { exportHTMLtoExcel } = require('../../../utilities/excel.js')
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
        .map((r, index) => {
          const cr = r
          cr.id = r.id || index
          return r
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

    exportResult() {
      dialog.showSaveDialog(
        getCurrentWindow(),
        {
          title: 'Choose destination for result file',
          defaultPath: home,
          properties: ['saveFile'],
          filters: [
            {
              name: 'Excel File',
              extensions: NATIVE_KEYS,
            },
          ],
        },
        dir => {
          if (dir)
            exportHTMLtoExcel(this.$refs.tbl_data, dir).then(() => {
              this.$toasted.show('File saved succesfully. ')
            })
        }
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.scroll-container
  width: 100%
  min-height: 296px
  overflow-x: auto

table.has-text-centered
  font-size: small
  .has-background-danger
    color: #fff
  th, td
    text-align: left
    vertical-align: middle
  th:nth-child(1)
    min-width: 50px
  th:nth-child(2)
    min-width: 75px
</style>
