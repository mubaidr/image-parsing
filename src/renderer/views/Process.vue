<template>
  <div>
    <Transition mode="out-in" name="slide-up">
      <keep-alive>
        <RouterView />
      </keep-alive>
    </Transition>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
