<template>
  <div>lolian bc
    <vue-good-table
      :fixed-header="true"
      :line-numbers="true"
      :rows="results"
      :sort-options="{
        enabled: true,
      }"
    >
      <div slot="emptystate">This will show up when there are no rows</div>
      <div slot="table-actions">This will show up on the top right of the table.</div>
      <div slot="table-actions-bottom">This will show up on the bottom of the table.</div>
    </vue-good-table>
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
    return {}
  },

  computed: {
    columns() {
      return {}
    },
  },

  mounted() {},
}
</script>

<style>
</style>
