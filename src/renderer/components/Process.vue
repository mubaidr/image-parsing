<template>
  <div class="section">
    <Transition mode="out-in" name="slide-left">
      <review-result :compiledResult="compiledResult" v-if="compiledResult" />
      <extract-result @compiledResult="gotCompiledResult" v-else />
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
      compiledResult: null,
    }
  },

  methods: {
    gotCompiledResult(m) {
      this.$set(this, 'compiledResult', m.compiledResult)
    },
  },
}
</script>

<style></style>
