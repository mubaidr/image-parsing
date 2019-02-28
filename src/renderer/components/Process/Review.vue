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
        placeholder: 'Filter table by roll number'
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'rollNo', type: 'asc'}
      }"
      @on-row-dblclick="onRowDoubleClick"
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

          <!-- Modal -->
          <modal
            :adaptive="true"
            :name="props.formattedRow.id"
            :scrollable="true"
            @click="closePreview(props.formattedRow.id)"
            height="auto"
            max-width="640px"
            pivot-y:number="0.25"
            width="480px"
          >
            <button
              @click="closePreview(props.formattedRow.id)"
              class="button is-danger is-small top-right-absolute"
            >
              <i class="material-icons">close</i>
            </button>
            <!-- Form -->
            <div class="section">
              <div class="field">
                <br>
                <div class="columns">
                  <div class="column is-2">
                    <button class="button is-info">Previous</button>
                  </div>
                  <div class="column">
                    <div class="control">
                  <input
                    :id="props.formattedRow.id"
                    :ref="props.formattedRow.id"
                    class="input is-info"
                    maxlength="9"
                    minlength="5"
                    pattern="/[1-9]{2}[a-z]-[0-9]{5}/gim"
                    placeholder="Roll #"
                    required
                    v-model="finalResults[props.row.originalIndex]['rollNo']"
                    type="text"
                  >
                </div>
                  </div>
                  <div class="column is-2">
                    <button class="button is-info">Next</button>
                  </div>
                </div>
              </div>
              <!-- Preview -->
              <img :src="imageSource">
            </div>
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
          thClass: 'wide-col',
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
        // set image source
        this.imageSource = s

        // open modal
        this.$modal.show(row.id)

        console.log(row.id, Object.keys(this.$refs))

        // focus text box
        this.$refs[row.id].focus()
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
</style>
