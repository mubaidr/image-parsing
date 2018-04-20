<template>
  <div class="section">
    <h1 class="title">Generate</h1>
    <h2 class="subtitle">Generate Answer Sheets.</h2>
    <div class="tabs is-centered">
      <ul>
        <li v-for="(route, index) in routeChildren"
            :key="index"
            :class="{'is-active' : $route.path.indexOf(route.path) !== -1}"
            class='is-disabled'>
          <router-link :to="`/generate/${route.path}`">
            <span class="icon">
              <i class="fas"
                 :class="route.meta.icon" />
            </span>{{ route.meta.title }}</router-link>
        </li>
      </ul>
    </div>

    <!-- Child routes -->
    <transition name="slide-up"
                appear="appear"
                mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeChildren: []
    }
  },

  created() {
    this.routeChildren = this.$router.options.routes.filter(
      route => route.path === '/generate'
    )[0].children

    this.$router.push('/generate/choose-design')
  }
}
</script>

<style>

</style>
