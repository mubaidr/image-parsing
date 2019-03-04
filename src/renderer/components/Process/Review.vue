<template>
  <div>
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
          v-for="result in results"
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
import modalPreview from './_modal-preview'

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
    }
  },

  computed: {
    // TODO implement sorting and filtering
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
table.has-text-centered
  th.sortable
    cursor: pointer
    padding: 0.25em 1.5em
  th, td
    text-align: center
    vertical-align: middle
</style>
