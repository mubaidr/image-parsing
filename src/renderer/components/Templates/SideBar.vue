<template>
  <div
    :class="{'is-active': isNavBarWide}"
    class="navigation-view is-static">
    <a
      :class="{'is-active': isNavBarWide}"
      class="navbar-burger"
      role="button"
      aria-expanded="false"
      aria-label="menu"
      @click="toggleNavigationView">
      <span aria-hidden="true"/>
      <span aria-hidden="true"/>
      <span aria-hidden="true"/>
    </a>
    <aside class="menu">
      <ul class="menu-list">
        <li
          v-for="(route, index) in routes"
          :key="index">
          <router-link
            :to="route"
            :title="route.meta.title"
            active-class="is-active">
            <span class="icon">
              <i
                :class="route.meta.icon"
                class="fa"/>
            </span>
            <span>{{ route.meta.title }}</span>
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isNavBarWide: false,
      routes: [],
    }
  },
  created() {
    this.routes = this.$router.options.routes.filter(
      route => route.path !== '*' && route.path !== '/'
    )

    // this.$electron.ipcRenderer.send('set-menu', this.routes)
  },
  methods: {
    toggleNavigationView() {
      this.isNavBarWide = !this.isNavBarWide
    },
  },
}
</script>

<style>
</style>
