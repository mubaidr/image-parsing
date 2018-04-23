<template>
  <div>
    <load-design-files @directory="updateOptions"></load-design-files>
  </div>
</template>

<script>
import LoadDesignFiles from '@/components/Templates/LoadDesignFiles'

export default {
  components: {
    LoadDesignFiles
  },

  methods: {
    updateOptions(dir) {
      const opt = this.options
      opt.generate.source.design = dir

      this.setOptions(opt)
    }
  }
}
</script>

<style>

</style>
