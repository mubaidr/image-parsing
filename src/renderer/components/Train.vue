<template>
  <div class="section">
    <h1 class="title">Train Network</h1>
    <br/>

    <h2 class="subtitle">Design</h2>
    <load-files @directory="updateOptionsDesign"
                file-type="design"
                :default-path="options.train.source.design">
    </load-files>

    <h2 class="subtitle">Images</h2>
    <load-files @directory="updateOptionsData"
                file-type="image"
                :default-path="options.train.source.data">
    </load-files>

    <h2 class="subtitle">Result</h2>
    <load-files @directory="updateOptionsResult"
                file-type="excel"
                :default-path="options.train.source.result">
    </load-files>
  </div>
</template>

<script>
import loadFiles from './Templates/LoadFiles'

export default {
  name: 'About',

  components: { loadFiles },

  methods: {
    updateOptionsDesign(dir) {
      const opt = JSON.parse(JSON.stringify(this.options))
      opt.train.source.design = dir

      this.setOptions(opt)
    },

    updateOptionsData(dir) {
      const opt = JSON.parse(JSON.stringify(this.options))
      opt.train.source.data = dir

      this.setOptions(opt)
    },

    updateOptionsResult(dir) {
      const opt = JSON.parse(JSON.stringify(this.options))
      opt.train.source.result = dir

      this.setOptions(opt)
    }
  }
}
</script>

<style>

</style>
