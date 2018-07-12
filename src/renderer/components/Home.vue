<template>
  <div>
    <div class="header-background">
      <section class="hero is-dark is-medium">
        <!-- Hero content: will be in the middle -->
        <div class="hero-body">
          <div class="block has-text-centered">
            <figure class="image is-128x128">
              <img
                src="../../../IconDesigns/512icontype12.png"
                alt="Placeholder image">
            </figure>
          </div>
          <div class="container has-text-centered">
            <h1 class="title is-1">
              Image Parsing
            </h1>
            <h2 class="subtitle">Generate answeer sheets and extract results from the scanned answer sheets. </h2>
          </div>
          <br>
          <div class="columns">
            <div class="column is-3 is-offset-3">
              <router-link
                to="generate"
                class="button is-light is-fullwidth is-medium">
                <span class="icon">
                  <i
                    class="fa fa-file-alt"/>
                </span>
                <span>Generate</span>
              </router-link>
            </div>
            <div class="column is-3">
              <router-link
                to="process"
                class="button is-light is-fullwidth is-medium">
                <span class="icon">
                  <i
                    class="fa fa-play"/>
                </span>
                <span>Process</span>
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style>
.hero {
  min-height: 100vh;
}
</style>
