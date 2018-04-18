<template>
  <div class="section">
    <h1 class="title">Design Tool</h1>
    <h2 class="subtitle">Create a new design or update an exisitng one.</h2>

    <design-options></design-options>
    <div class="columns">
      <div class="column is-3">

        <design-tool></design-tool>

      </div>
      <div class="column">

        <design-panel></design-panel>

      </div>
    </div>
  </div>
</template>

<script>
import DesignOptions from './Design/Options'
import DesignTool from './Design/Tools'
import DesignPanel from './Design/Panel'

export default {
  components: {
    DesignOptions,
    DesignTool,
    DesignPanel
  }
}
</script>

<style lang="sass">

</style>
