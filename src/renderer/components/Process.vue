<template>
  <div class="section">
    <h1 class="title is-5">Process</h1>
    <h2 class="subtitle is-6">Process scanned images to generate result.</h2>

    <Transition
      mode="out-in"
      name="slide-left"
    >
      <extract-result
        @completed="getExtractedResult"
        v-if="!extractedResult"
      />
      <review-result
        :results="extractedResult"
        v-else
      />
    </Transition>
  </div>
</template>

<script>
import extractResult from '@components/Process/Extract.vue'
import reviewResult from '@components/Process/Review.vue'

export default {
  name: 'Process',

  components: {
    extractResult,
    reviewResult,
  },

  data() {
    return {
      extractedResult: null,
    }
  },

  watch: {},

  methods: {
    getExtractedResult(r) {
      window.setTimeout(() => {
        this.extractedResult = r
      }, 100)
    },
  },
}
</script>

<style>
</style>
