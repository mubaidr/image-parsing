<template>
  <div class="section">
    <Transition mode="out-in" name="slide-left">
      <review-result :results="extractedResult" v-if="extractedResult" />
      <extract-result @results="getExtractedResult" v-else />
    </Transition>
  </div>
</template>

<script>
import extractResult from './Process/Extract.vue'
import reviewResult from './Process/Review.vue'

export default {
  name: 'Process',

  components: {
    extractResult,
    reviewResult,
  },

  data() {
    return {
      extractedResult: null,
      extractedKey: null,
    }
  },

  methods: {
    getExtractedResult(m) {
      this.$set(this, 'extractedResult', m.results)
    },
  },
}
</script>

<style></style>
