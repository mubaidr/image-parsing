<template>
  <div id="app">
    <menu-view/>
    <div class="content-custom">
      <transition name="slide-right"
                  appear="appear"
                  mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import menuView from './components/Templates/Menu'

export default {
  name: 'image-parsing',
  components: {
    menuView
  },
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
  }
}
</script>

<style>
/* CSS */
</style>
