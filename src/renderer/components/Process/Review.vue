<template>
  <div>
    <vue-good-table
      :columns="columns"
      :line-numbers="true"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 10,
      }"
      :rows="finalResults"
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
          <button
            @click="openPreview(props.formattedRow.id)"
            class="button is-light is-small"
          >
            <span class="icon">
              <i class="fa fa-image"/>
            </span>
            <span>Preview</span>
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
            <img :src="props.formattedRow[props.column.field]">
          </modal>
        </span>
        <span v-else>{{props.formattedRow[props.column.field]}}</span>
      </template>
    </vue-good-table>
    <!-- {{columns}} -->
  </div>
</template>

<script>
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
    }
  },

  computed: {
    columns() {
      const columns = []

      Object.keys(this.finalResults[0]).forEach(item => {
        const column = {
          label: this.toProperCase(item),
          field: item,
          hidden: item.includes('id'),
          sortable: true,
        }

        columns.push(column)
      })

      return columns
    },
  },

  created() {
    this.$set(this, 'finalResults', this.results)
  },

  methods: {
    openPreview(id) {
      this.$modal.show(id)
    },
    closePreview(id) {
      this.$modal.hide(id)
    },
    toProperCase(item) {
      return item[0].toUpperCase() + item.substr(1)
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
</style>
