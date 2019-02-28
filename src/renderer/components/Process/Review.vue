<template>
  <div>
    <vue-good-table
      :columns="columns"
      :line-numbers="true"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 10,
        position: 'top',
      }"
      :rows="finalResults"
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
      style-class="vgt-table condensed"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >
        <span v-if="props.column.field == 'img'">
          <button
            @click="openPreview(props.formattedRow)"
            class="button is-small is-light"
          >
            <span class="icon is-small">
              <i class="fa fa-image"/>
            </span>
          </button>
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
                <span class="is-small icon">
                  <i class="fa fa-times"/>
                </span>
              </button>
            </div>
            <img :src="imageSource">
          </modal>
        </span>
        <span v-else-if="props.column.field == 'rollNo' && !props.formattedRow[props.column.field]">
          <div class="field">
            <div class="control has-icons-left">
              <input
                class="input is-small"
                maxlength="9"
                minlength="5"
                pattern="/[1-9]{2}[a-z]-[0-9]{5}/gim"
                placeholder="Roll #"
                required
                v-model="finalResults[0]['rollNo']"
                type="text"
              >
              <span class="icon is-small is-left has-text-danger">
                <i class="fas fa-exclamation"></i>
              </span>
            </div>
          </div>
        </span>
        <span v-else>{{props.formattedRow[props.column.field]}}</span>
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
  },
}
</script>

<style lang="sass">
.vgt-table,
.vgt-table
  th, td
    padding: 0.25em 1.25em
    text-align: center
    vertical-align: middle
  th
    cursor: pointer
  input
    min-width: 90px
    padding-left: 1.75em!important

.vgt-wrap
  button,
  input[type=text]
      height: auto!important
</style>
