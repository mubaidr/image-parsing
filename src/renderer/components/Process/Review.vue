<template>
  <div>
    <!-- Toolbar -->
    <div class="field has-addons spaced">
      <p class="control">
        <input
          class="input is-small"
          placeholder="Filter By Roll No"
          v-model="filterQuery"
          type="text"
        >
      </p>
      <p class="control">
        <button
          @click="toggleSortOrder"
          class="button is-light is-small"
        >
          Sort By Roll No &nbsp;
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
          v-for="result in filteredResults"
          v-on:dblclick="selectRow(result)"
        >
          <template v-for="([column, value]) in Object.entries(result)">
            <td
              :key="result.id + '-' +column"
              v-if="columns.includes(column)"
            >
              <template v-if="column === 'rollNo' && !result.hasValidRollNo">
                <i
                  @click="selectRow(result)"
                  class="material-icons has-text-warning has-pointer"
                >warning</i>
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
        v-if="selectedRow"
      />
    </Transition>
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
      selectedRow: null,
      sortOrder: 'asc',
      filterQuery: '',
    }
  },

  computed: {
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
    selectRow(row) {
      this.selectedRow = row
    },

    unSelectRow() {
      this.selectedRow = null
    },

    selectNextRow() {
      // TODO: implement next row method
      console.log('next row')
    },

    selectPreviousRow() {
      // TODO: implement next row method
      console.log('previous row')
    },

    toggleSortOrder() {
      if (this.sortOrder === 'asc') this.sortOrder = 'desc'
      else this.sortOrder = 'asc'
    },

    handleKeyDown(e) {
      switch (e.key) {
        case 'Escape':
          this.unSelectRow()
          break
        case 'Tab':
          if (e.shiftKey) this.selectPreviousRow()
          else this.selectNextRow()
          break
        case ' ':
        case 'ArrowRight':
        case 'ArrowDown':
          this.selectNextRow()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          this.selectPreviousRow()
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
  th.sortable
    cursor: pointer
    padding: 0.25em 1.5em
  th, td
    text-align: center
    vertical-align: middle
</style>
