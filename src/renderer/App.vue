<template>
  <div id="app">
    <div class="content-custom">
      <Transition name="slide-up" mode="out-in">
        <RouterView />
      </Transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageParsing',
}
</script>

<style lang="sass"></style>
