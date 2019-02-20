<template>
  <div id="app">
    <Transition
      mode="out-in"
      name="slide-up"
    >
      <RouterView/>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'ImageParsing',
}
</script>

<style lang="sass"></style>
