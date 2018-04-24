<template>
  <div>
    <load-files @directory="updateOptions"></load-files>
  </div>
</template>

<script>
import LoadFiles from '~/components/Templates/LoadFiles'

export default {
  components: {
    LoadFiles
  },

  methods: {
    updateOptions(dir) {
      const opt = this.options
      opt.process.source.data = dir

      this.setOptions(opt)
    }
  }
}
</script>

<style>

</style>
