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
        :row="selectedRow"
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
      // finalResults: [],
      selectedRow: null,
    }
  },

  computed: {
    columns() {
      return Object.keys(this.results[0]).map(col => col)
    },
  },

  created() {
    // this.$set(this, 'finalResults', this.results)
  },

  methods: {
    selectRow(row) {
      this.selectedRow = row
    },

    unSelectRow() {
      this.selectedRow = null
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
