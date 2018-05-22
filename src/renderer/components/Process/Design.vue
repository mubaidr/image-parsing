<template>
  <div>
    <load-files 
      :is-file="true"
      file-type="design"
      option="process.source.design"/>
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
