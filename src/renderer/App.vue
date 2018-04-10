<template>
  <div id="app">
    <div class="content-custom">
      <transition :name="transitionName"
                  appear="appear"
                  mode="out-in">
        <router-view/>
      </transition>
    </div>

    <router-link to="/home">Home</router-link>
    <router-link to="/load">Load</router-link>
    <router-link to="/process">Process</router-link>
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
// eslint-disable-next-line
import { ipcRenderer } from 'electron'

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
    // send routes to main process to set menu
    ipcRenderer.send('set-menu', this.$router.options.routes)
  }
}
</script>

<style lang="sass">
</style>
