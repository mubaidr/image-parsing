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
    <pre>
      {{options}}
    </pre>
  </div>
</template>

<script>
import NavBar from './components/Templates/NavBar'

export default {
  name: 'ImageParsing',

  components: { NavBar }
}
</script>

<style lang="sass">
</style>
