<template>
  <div>
    <vue-good-table
      :columns="[{
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Age',
          field: 'age',
          type: 'number',
        },]"
      :rows="data"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {
      columns: [],
      rows: [],
    }
  },

  mounted() {
    console.log(this.data.length, this.data[0].length, this.data)
  },
}
</script>

<style>
</style>
