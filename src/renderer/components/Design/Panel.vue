<template>
  <div class="box">
    <h1>Panel</h1>
  </div>
</template>

<script>
import tool from './Panel/tool'

console.log(tool)

export default {
  mounted() {
    tool.init()
  }
}
</script>

<style>

</style>
