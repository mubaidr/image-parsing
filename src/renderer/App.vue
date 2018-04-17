<template>
  <div id="app">
    <nav-bar></nav-bar>
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
// eslint-disable-next-line
import { ipcRenderer } from 'electron'
import NavBar from './components/Templates/NavBar'

export default {
  name: 'ImageParsing',

  components: { NavBar },

  created() {
    // send routes to main process to set menu
    // TODO: use vuex menu data to create menu for application
    ipcRenderer.send('set-menu', this.$router.options.routes)
  }
}
</script>

<style lang="sass">
</style>
