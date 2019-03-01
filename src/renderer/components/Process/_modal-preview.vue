<template>
  <div class="modal is-active">
    <div
      @click="closeModal"
      class="modal-background"
    ></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Answer Sheet</p>
        <button
          @click="closeModal"
          aria-label="close"
          class="delete is-large"
        ></button>
      </header>
      <section class="modal-card-body">
        <!-- Preview -->
        <img
          :src="imageSource"
          v-show="imageSource"
        >
      </section>
      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>

<script>
const { convertImage } = require('../../../utilities/images.js')

export default {
  name: 'ModalPreview',

  props: {
    row: {
      type: Object,
      default() {
        return null
      },
    },
  },

  data() {
    return {
      imageSource: null,
    }
  },

  mounted() {
    convertImage(this.row.img).then(src => {
      this.imageSource = src
    })
  },

  methods: {
    closeModal() {
      this.$emit('close-modal')
      this.imageSource = null
    },
  },
}
</script>

<style>
</style>
