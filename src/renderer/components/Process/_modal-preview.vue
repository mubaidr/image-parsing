<template>
  <div class="modal is-active">
    <div
      @click="closeModal"
      class="modal-background"
    ></div>
    <button
      @click="closeModal"
      aria-label="close"
      class="delete is-large is-top-right"
    ></button>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="columns is-mobile">
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
                  :class="{'is-danger' : !row.hasValidRollNo}"
                  :readonly="row.hasValidRollNo"
                  class="input has-text-centered is-uppercase has-text-weight-bold is-family-code"
                  placeholder="Roll No"
                  ref="txt_roll_no"
                  type="text"
                  v-model="row.rollNo"
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
      </header>

      <section class="modal-card-body">
        <!-- Preview -->
        <img
          :src="imageSource"
          v-show="imageSource"
        >
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ModalPreview',

  props: {
    selectedRow: {
      type: Object,
      default() {
        return null
      },
    },

    imageSource: {
      type: String,
      default() {
        return ''
      },
    },
  },

  data() {
    return {
      row: null,
    }
  },

  watch: {
    selectedRow(val) {
      this.row = val

      this.$refs.txt_roll_no.focus()
    },
  },

  created() {
    this.row = this.selectedRow
  },

  mounted() {
    this.$refs.txt_roll_no.focus()
  },

  methods: {
    closeModal() {
      this.$emit('close-modal')
      this.row = null
    },

    next() {
      this.$emit('next')
    },

    previous() {
      this.$emit('previous')
    },
  },
})
</script>

<style lang="sass">
.modal-card-head
  .columns
    width: calc(100% + 1.5rem)

.delete.is-top-right
  position: absolute
  top: 0
  right: 0
  z-index: 99999
</style>
