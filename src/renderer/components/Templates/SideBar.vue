<template>
  <!-- <div
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
  </div> -->
  <div>
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation">
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="https://bulma.io">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28">
        </a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample">
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            Home
          </a>

          <a class="navbar-item">
            Documentation
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              More
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                About
              </a>
              <a class="navbar-item">
                Jobs
              </a>
              <a class="navbar-item">
                Contact
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item">
                Report an issue
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
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
      route =>
        route.path !== '*' && route.path !== '/' && route.path !== '/train',
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
