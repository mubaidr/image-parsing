<template>
  <div id="app">
    <nav-bar></nav-bar>
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
// eslint-disable-next-line
import { ipcRenderer } from 'electron'
import NavBar from './components/Templates/NavBar'

export default {
  name: 'ImageParsing',

  components: { NavBar },

  data() {
    return {
      transitionName: 'slide-right'
    }
  },

  watch: {
    $route(to, from) {
      // this.setTransition(to, from)
    }
  },

  created() {
    // send routes to main process to set menu
    ipcRenderer.send('set-menu', this.$router.options.routes)
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

<style lang="sass">
</style>
