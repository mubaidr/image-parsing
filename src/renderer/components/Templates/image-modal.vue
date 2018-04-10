<template>
  <div class="modal"
       :class="{'is-active': previewFile}"
       v-if="previewFile">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="previewFilePath"
                 alt="Preview Image">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ previewFile }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large"
            aria-label="close"
            @click="$emit('close');"
            @keyup.esc="$emit('close');"
            ref="btnClose"
            autofocus></button>
  </div>
</template>

<script>
export default {
  props: ['previewFile', 'previewFilePath'],
  watch: {
    previewFile(val) {
      if (val)
        this.$nextTick(() => {
          this.$refs.btnClose.focus()
        })
    }
  }
}
</script>

<style>

</style>
