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
// import SystemInformation from '../components/SystemInformation'

export default {
  name: 'About',
  // components: { SystemInformation },
}
</script>

<style>
.block.has-text-centered figure {
  margin: 0 auto;
}
</style>
