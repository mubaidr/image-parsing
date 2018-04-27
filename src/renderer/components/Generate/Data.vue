<template>
  <div>
    <load-files @directory="updateOptions"
                file-type="excel"
                :is-file="true"></load-files>
  </div>
</template>

<script>
import LoadFiles from '@/components/Templates/LoadFiles'

export default {
  components: {
    LoadFiles
  },

  methods: {
    updateOptions(dir) {
      const opt = JSON.parse(JSON.stringify(this.options))
      opt.generate.source.data = dir

      this.setOptions(opt)
    }
  }
}
</script>

<style>

</style>
