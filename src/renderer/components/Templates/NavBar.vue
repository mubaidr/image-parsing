<template>
  <div class="navigation-bar is-static"
       :class="{'is-active': isNavBarWide}">
    <button class="button"
            @click="isNavBarWide = !isNavBarWide">
      <span class="icon">
        <i class="fas fa-bars" />
      </span>
    </button>
    <aside class="menu">
      <ul class="menu-list">
        <li v-for="(route, index) in routes"
            :key="index"
            :class="{'is-active' : $route.path.indexOf(route.path) !== -1}"
            @click="$router.push(route.path)"
            :title="route.name">

          <span class="icon">
            <i class="fas"
               :class="route.meta.icon" />
          </span>
          <span>{{route.name}}</span>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      isNavBarWide: false,
      routes: []
    }
  },

  created() {
    this.routes = this.$router.options.routes.filter(
      route => route.path !== '*' && route.path !== '/'
    )
  }
}
</script>

<style>
.menu-list li span {
  cursor: default;
}
</style>
