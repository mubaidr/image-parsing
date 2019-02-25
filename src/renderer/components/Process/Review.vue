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
      }"
      :sort-options="{
        enabled: true,
      }"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >
        <span v-if="props.column.field == 'img'">
          <!-- <img
            :src="props.formattedRow[props.column.field]"
            @click="openPreview(props.formattedRow.id)"
          >-->
          <!-- {{props}} -->
          <button
            @click="openPreview(props.formattedRow)"
            class="button is-info"
          >
            <span class="icon">
              <i class="fa fa-image"/>
            </span>
          </button>
          <modal
            :name="props.formattedRow.id"
            :scrollable="true"
            @click="closePreview(props.formattedRow.id)"
            height="auto"
          >
            <div class="has-text-right">
              <button
                @click="closePreview(props.formattedRow.id)"
                class="button is-danger is-small"
              >
                <span class="icon">
                  <i class="fa fa-times"/>
                </span>
              </button>
            </div>
            <img :src="imageSource">
          </modal>
        </span>
        <span v-else>{{props.formattedRow[props.column.field]}}</span>
      </template>
    </vue-good-table>
    <!-- {{columns}} -->
  </div>
</template>

<script>
const imageUtilities = require('../../../utilities/images.js')

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
        { label: 'Roll #', field: 'rollNo', sortable: true },
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
      this.setImageSource(row.img)

      this.$modal.show(row.id)
    },
    closePreview(id) {
      this.$modal.hide(id)
    },
    toProperCase(item) {
      return item[0].toUpperCase() + item.substr(1)
    },
    setImageSource(src) {
      imageUtilities.convertImage(src).then(s => {
        this.imageSource = s
      })
    },
  },
}
</script>

<style lang="sass">
.vgt-table.bordered,
.vgt-table.bordered
  th, td
    padding: 0.25em 1.25em
    text-align: center
    vertical-align: middle
  th
    cursor: pointer

.vgt-wrap
  button,
  input[type=text]
      height: auto!important
</style>
