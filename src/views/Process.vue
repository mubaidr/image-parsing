<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide-up">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
