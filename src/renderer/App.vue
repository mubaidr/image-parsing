<template>
  <div id="app">
    <div class="navigation-bar is-static">
      <aside class="menu">
        <p class="menu-label">
          Main Menu
        </p>
        <ul class="menu-list">
          <li :class="{'is-active': $route.path === '/home' || $route.path === '/'}">
            <router-link 
              to="/home"
              title="Getting Started">
              <span class="icon">
                <i class="fas fa-arrow-right" />
              </span>
              <span>Getting Started</span>
            </router-link>
          </li>
          <li :class="{'is-active': $route.path === '/form'}">
            <router-link 
              to="/form"
              title="Form Inputs">
              <span class="icon">
                <i class="fas fa-clipboard" />
              </span>
              <span>Form Inputs</span>
            </router-link>
          </li>
          <li :class="{'is-active': $route.path === '/elements'}">
            <router-link 
              to="/elements"
              title="Elements">
              <span class="icon">
                <i class="fas fa-list" />
              </span>
              <span>Elements</span>
            </router-link>
          </li>
          <li :class="{'is-active': $route.path === '/components'}">
            <router-link 
              to="/components"
              title="Components">
              <span class="icon">
                <i class="fas fa-box" />
              </span>
              <span>Components</span>
            </router-link>
          </li>
          <li :class="{'is-active': $route.path === '/extras'}">
            <router-link 
              to="/extras"
              title="Extras">
              <span class="icon">
                <i class="fas fa-box" />
              </span>
              <span>Extras</span>
            </router-link>
          </li>
        </ul>
        <p class="menu-label">
          Source
        </p>
        <ul class="menu-list">
          <li>
            <a 
              href="https://github.com/mubaidr/bulma-fluent"
              title="Github Repository"
              target="_blank">
              <span class="icon">
                <i 
                  class="fas fa-github"
                  aria-hidden="true" />
              </span>
              <span>Github</span>
            </a>
          </li>
          <li>
            <a 
              href="https://raw.githubusercontent.com/mubaidr/bulma-fluent/master/css/bulma.min.css"

              title="Download"
              target="_blank">
              <span class="icon">
                <i 
                  class="fas fa-download"
                  aria-hidden="true" />
              </span>
              <span>Download</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="content-custom">
      <transition 
        :name="transitionName"
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
  name: 'ImageParsing',
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
  created() {
    // send routes to main process to set menu
    ipcRenderer.send('set-menu', this.$router.options.routes)

    // TODO: check global variable
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
}
</script>

<style lang="sass">
</style>
