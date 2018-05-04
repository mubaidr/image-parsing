<template>
  <div 
    :class="{'is-active': isNavBarWide}"
    class="navigation-bar is-static">
    <button 
      class="button"
      @click="isNavBarWide = !isNavBarWide">
      <span class="icon">
        <i class="fa fa-bars" />
      </span>
    </button>
    <aside class="menu">
      <ul class="menu-list">
        <li 
          v-for="(route, index) in routes"
          :key="index"
          :class="{'is-active' : $route.path.indexOf(route.path) !== -1}"
          :title="route.meta.title"
          @click="$router.push(route.path)">

          <span class="icon">
            <i 
              :class="route.meta.icon"
              class="fa" />
          </span>
          <span>{{ route.meta.title }}</span>
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
      routes: []
    }
  },

  created() {
    this.routes = this.$router.options.routes.filter(
      route => route.path !== '*' && route.path !== '/'
    )

    this.$electron.ipcRenderer.send('set-menu', this.routes)
  }
}
</script>

<style>
.menu-list li span {
  cursor: default;
}
</style>
