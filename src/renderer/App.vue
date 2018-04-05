<template>
  <div id="app">
    <div class="content-custom">
      <transition :name="transitionName"
                  appear="appear"
                  mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-parsing',
  components: {},
  data() {
    return {
      transitionName: 'slide-up'
    }
  },
  watch: {
    $route(to, from) {
      this.setTransition(to, from)
    }
  },
  methods: {
    setTransition(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      if (toDepth === fromDepth) {
        this.transitionName = 'slide-up'
      } else {
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  },
  created() {
    // mainWindow.setMenu(null)
    // TODO: load/set menu from vue-router config on vue-app-ready
  }
}
</script>

<style lang="sass"></style>
