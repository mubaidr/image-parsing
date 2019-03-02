<template>
  <div class="modal is-active">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
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
      <footer class="modal-card-foot">
        <button class="button is-info">
          <i class="material-icons">skip_previous</i>
        </button>
        <button class="button is-info">
          <i class="material-icons">skip_next</i>
        </button>
      </footer>
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
