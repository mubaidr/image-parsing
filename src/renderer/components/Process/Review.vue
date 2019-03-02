<template>
  <div>
    <!-- Data list -->
    <vue-good-table
      :columns="columns"
      :line-numbers="true"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 10,
        position: 'bottom',
      }"
      :rows="results"
      :search-options="{
        enabled: true,
        skipDiacritics: true,
        searchFn: searchFunction,
        placeholder: 'Filter table by roll number'
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'rollNo', type: 'asc'}
      }"
      @on-row-dblclick="onRowDoubleClick"
      style-class="vgt-table table is-bordered is-hoverable"
    >
      <template
        slot="table-row"
        slot-scope="row"
      >
        <template v-if="row.column.field == 'rollNo'">
          <i
            @click="selectRow(row.formattedRow)"
            v-if="!row.formattedRow['hasValidRollNo']"
            class="material-icons has-text-warning has-pointer"
          >warning</i>
          {{row.formattedRow[row.column.field]}}
        </template>
        <template v-else>{{row.formattedRow[row.column.field]}}</template>
      </template>
    </vue-good-table>

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
      finalResults: [],
      selectedRow: null,
    }
  },

  computed: {
    columns() {
      const columns = [
        { field: 'id', hidden: true },
        { field: 'img', hidden: true, sortable: false },
        { field: 'hasValidRollNo', hidden: true, sortable: false },
        {
          label: 'Roll #',
          field: 'rollNo',
          sortable: true,
          thClass: 'wide-col',
        },
      ]

      Object.keys(this.finalResults[0]).forEach(item => {
        // insert questions
        // TODO: use regexp to match
        if (item[0] === 'Q') {
          columns.push({
            label: this.toProperCase(item),
            field: item,
            globalSearchDisabled: true,
            sortable: false,
          })
        }
      })

      return columns
    },
  },

  created() {
    this.$set(this, 'finalResults', this.results)
  },

  methods: {
    selectRow(row) {
      this.selectedRow = row
    },

    unSelectRow() {
      this.selectedRow = null
    },

    onRowDoubleClick(params) {
      this.selectRow(params.row)
    },

    toProperCase(item) {
      return item[0].toUpperCase() + item.substr(1)
    },

    searchFunction(row, col, cellValue, searchTerm) {
      if (col.field === 'rollNo' && cellValue) {
        return cellValue.includes(searchTerm)
      }

      return false
    },
  },
}
</script>

<style lang="sass">
.top-right-absolute
  position: absolute
  right: 0

.vgt-table
  th, td
    padding: 0.5em!important
    text-align: center!important
    vertical-align: middle!important
    .material-icons
      display: block
  th
    cursor: pointer

.vgt-wrap__footer
  border-top: none!important

.vgt-global-search__input
  padding-left: 42px!important
  .input__icon
    top: 7px
    left: 2px!important

.wide-col
  min-width: 95px

.vgt-wrap__footer.vgt-clearfix
  padding: 0.5em 1em
  input, select
    height: 2em!important

.footer__navigation__page-info
  input.footer__navigation__page-info__current-entry
    height: 2em!important

.vgt-input
  border-radius: 0!important

.v--modal-overlay
  background: rgba(0,0,0,0.80)

</style>
