<template>
  <div class="navigation-bar is-static" :class="{'is-active': isNavBarWide}">
    <button class="button" @click="isNavBarWide = !isNavBarWide">
      <span class="icon">
        <i class="fa fa-bars">
        </i>
      </span>
    </button>
    <aside class="menu">
      <ul class="menu-list">
        <li v-for="(route, index) in routes" :key="index">
          <router-link active-class="is-active" :to="route" :title="route.meta.title">
            <span class="icon">
              <i class="fa" :class="route.meta.icon">
              </i>
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

    this.$electron.ipcRenderer.send('set-menu', this.routes)
  },
}
</script>

<style>
</style>
