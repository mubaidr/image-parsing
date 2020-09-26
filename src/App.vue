<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide-up">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts"></script>
<style></style>
