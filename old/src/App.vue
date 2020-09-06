<template>
  <div id="app" class="container-fluid">
    <Transition mode="out-in" name="slide-up">
      <RouterView />
    </Transition>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss"></style>
