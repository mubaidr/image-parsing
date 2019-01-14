<template>
  <div class="section">
    <h1 class="title">Help</h1>
    <br />
    <h2 class="subtitle is-4">Coming soon...</h2>

    <h2 class="subtitle is-4">System Information</h2>
    <SystemInformation />
    <br />
  </div>
</template>

<script>
import SystemInformation from './About/SystemInformation.vue'

export default {
  name: 'About',
  components: { SystemInformation },
}
</script>

<style>
.block.has-text-centered figure {
  margin: 0 auto;
}
</style>
