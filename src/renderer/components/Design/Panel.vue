<template>
  <div class="box">
    <h1>Panel</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
import tool from './Panel/tool'

export default {
  mounted() {
    tool.init(this.$refs.myCanvas)
  }
}
</script>

<style>

</style>
