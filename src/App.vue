<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide-up">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts"></script>
<style></style>
