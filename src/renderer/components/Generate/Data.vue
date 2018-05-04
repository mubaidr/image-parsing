<template>
  <div>
    <load-files 
      :is-file="true"
      option="generate.source.excel"
      file-type="excel"/>
  </div>
</template>

<script>
import LoadFiles from '@/components/Templates/LoadFiles'

export default {
  components: {
    LoadFiles
  }
}
</script>

<style>

</style>
