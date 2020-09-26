<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide-up">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
