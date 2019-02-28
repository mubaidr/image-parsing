<template>
  <div>
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
        placeholder: 'Filter data by roll number'
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'rollNo', type: 'asc'}
      }"
      @on-row-dblclick="onRowDoubleClick"
      style-class="vgt-table"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >
        <template v-if="props.column.field == 'img'">
          <a
            @click="openPreview(props.formattedRow)"
            href="#"
          >
            <i class="material-icons md-36">image</i>
          </a>

          <modal
            :adaptive="true"
            :name="props.formattedRow.id"
            :scrollable="true"
            @click="closePreview(props.formattedRow.id)"
            height="auto"
            pivot-y:number="0.25"
          >
            <div class="has-text-right">
              <button
                @click="closePreview(props.formattedRow.id)"
                class="button is-danger is-small"
              >
                <i class="material-icons">close</i>
              </button>
            </div>
            <img :src="imageSource">
          </modal>
        </template>
        <template
          v-else-if="props.column.field == 'rollNo' && !props.formattedRow[props.column.field]"
        >
          <i
            @click="openPreview(props.formattedRow)"
            class="material-icons has-text-warning has-pointer"
          >warning</i>
        </template>
        <template v-else>{{props.formattedRow[props.column.field]}}</template>
      </template>
    </vue-good-table>
    <!-- {{finalResults}} -->
    <!-- {{columns}} -->
  </div>
</template>

<script>
const { convertImage } = require('../../../utilities/images.js')

export default {
  name: 'ReviewResult',

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
      imageSource: null,
    }
  },

  computed: {
    columns() {
      const columns = [
        { field: 'id', hidden: true },
        { label: '', field: 'img', sortable: false },
        {
          label: 'Roll #',
          field: 'rollNo',
          sortable: true,
          // filterOptions: {
          //   enabled: true,
          // },
        },
      ]

      Object.keys(this.finalResults[0]).forEach(item => {
        // insert questions
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
    openPreview(row) {
      convertImage(row.img).then(s => {
        this.imageSource = s

        this.$modal.show(row.id)
      })
    },

    closePreview(id) {
      this.$modal.hide(id)
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

    onRowDoubleClick(params) {
      this.openPreview(params.row)
    },
  },
}
</script>

<style lang="sass">
.vgt-table
  th, td
    padding: 0.5em!important
    padding-right: 2em!important
    text-align: center!important
    vertical-align: middle!important
    .left-align
      text-align: center!important
      vertical-align: middle!important
    .material-icons
      display: block
  th
    cursor: pointer

.vgt-input
  border-radius: 0!important
  height: 2em!important

.vgt-wrap__footer
  border-top: none!important

.vgt-global-search__input
  padding-left: 42px!important
  .input__icon
    top: 7px
    left: 2px!important
</style>
