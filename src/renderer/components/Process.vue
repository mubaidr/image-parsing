<template>
  <div class="section">
    <h1 class="title">Process</h1>
    <h2 class="subtitle">Process scanned images to generate result.</h2>
    <div class="tabs is-centered">
      <ul>
        <li v-for="(route, index) in routeChildren"
            :key="index"
            :class="{'is-active' : $route.path.indexOf(route.path) !== -1}"
            class='is-disabled'>
          <router-link :to="`/process/${route.path}`">
            <span class="icon">
              <i class="fas"
                 :class="route.meta.icon" />
            </span>{{ route.name }}</router-link>
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
      route => route.path === '/process'
    )[0].children

    this.$router.push('/process/chooseDesign')
  }
}
</script>

<style>

</style>
