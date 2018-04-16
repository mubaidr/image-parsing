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
        <li v-for="step in allSteps"
            :key="step.path"
            :class="{'is-active' : step.path === activeStep.path}"
            @click="gotoURL(step.path)"
            :title="step.name">
          <span class="icon">
            <i class="fas"
               :class="step.icon" />
          </span>
          <span>{{step.name}}</span>
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
      isNavBarWide: false
    }
  },

  computed: {
    ...mapGetters(['allSteps', 'activeStep'])
  },

  methods: {
    ...mapActions(['setActiveStep']),

    gotoURL(path) {
      this.setActiveStep(path)
      this.$router.push(path)
    }
  }
}
</script>

<style>

</style>
