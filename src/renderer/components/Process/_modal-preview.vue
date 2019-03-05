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
          class="delete"
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
        <div class="columns">
          <div class="column is-3">
            <a
              @click="previous"
              class="button is-pulled-left is-info"
            >
              <i class="material-icons">skip_previous</i>
            </a>
          </div>
          <div class="column">
            <div class="field">
              <p class="control">
                <input
                  :class="{'is-warning' : !row.hasValidRollNo}"
                  :readonly="row.hasValidRollNo"
                  class="input has-text-centered is-uppercase has-text-weight-bold is-family-code"
                  ref="txt_roll_no"
                  placeholder="Roll No"
                  v-model="row.rollNo"
                  type="text"
                >
              </p>
            </div>
          </div>
          <div class="column is-3">
            <a
              @click="next"
              class="button is-pulled-right is-info"
            >
              <i class="material-icons">skip_next</i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
const { convertImage } = require('../../../utilities/images.js')

export default {
  name: 'ModalPreview',

  props: {
    selectedRow: {
      type: Object,
      default() {
        return null
      },
    },
  },

  data() {
    return {
      row: null,
      imageSource: null,
    }
  },

  watch: {
    selectedRow(val) {
      this.row = val

      convertImage(this.row.img).then(src => {
        this.imageSource = src
      })

      this.$refs.txt_roll_no.focus()
    },
  },

  created() {
    this.row = this.selectedRow

    convertImage(this.row.img).then(src => {
      this.imageSource = src
    })
  },

  mounted() {
    this.$refs.txt_roll_no.focus()
  },

  methods: {
    closeModal() {
      this.$emit('close-modal')

      this.imageSource = null
      this.row = null
    },

    next() {
      this.$emit('next')
    },

    previous() {
      this.$emit('previous')
    },
  },
}
</script>

<style lang="sass">
.modal-card-foot
  .columns
    width: calc(100% + 1.5rem)
</style>
