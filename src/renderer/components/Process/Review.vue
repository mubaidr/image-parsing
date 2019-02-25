<template>
  <div>
    <vue-good-table
      :columns="columns"
      :line-numbers="true"
      :rows="finalResults"
      :sort-options="{
        enabled: true,
      }"
    ></vue-good-table>
    {{results}}
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
      return [
        {
          label: 'ID',
          field: 'id',
          filterable: true,
        },
        {
          label: 'rollNo',
          field: 'rollNo',
          type: 'number',
          filterable: true,
        },
        {
          label: 'img',
          field: 'img',
          filterable: true,
          html: true,
          formatFn: item => {
            return `<img src="${item}"/>`
          },
        },
      ]
    },
  },

  created() {
    window.setTimeout(() => {
      this.$set(this, 'finalResults', this.results)
    }, 0)
  },
}
</script>

<style>
</style>
