<template>
  <div>
    <!-- Toolbar -->
    <div class="field has-addons spaced">
      <p class="control">
        <button
          @click="toggleSortOrder"
          class="button is-light is-small"
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
      <p class="control">
        <input
          class="input is-small"
          placeholder="Filter"
          v-model="filterQuery"
          type="text"
        >
      </p>
    </div>

    <!-- Data list -->
    <table class="table is-bordered is-hoverable is-narrow has-text-centered">
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

    <!-- Preview component -->
    <!-- TODO add update data handle -->
    <Transition
      mode="out-in"
      name="slide-up"
    >
      <modal-preview
        :selected-row="selectedRow"
        @close-modal="unSelectRow"
        @next="selectNextRow"
        @previous="selectPreviousRow"
        v-if="selectedRow"
      />
    </Transition>
    {{results}}
  </div>
</template>

<script>
import modalPreview from './_modal-preview.vue'

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
        this.unSelectRow()
      }
    },

    selectPreviousRow() {
      const nextIndex = this.selectedIndex - 1

      if (nextIndex > -1) {
        this.selectedIndex = nextIndex
      } else {
        this.unSelectRow()
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
  },
}
</script>

<style lang="sass">
.field.has-addons.spaced
  .control
    margin-right: 1em

table.has-text-centered
  thead
    background-color: rgba(0,0,0,0.05)
  th.sortable
    cursor: pointer
    padding: 0.25em 1.5em
  th, td
    text-align: center
    vertical-align: middle
</style>
