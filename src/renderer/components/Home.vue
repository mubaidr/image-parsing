<template>
  <div>
    <section class="hero is-white">
      <div class="hero-body">
        <br>
        <div class="block has-text-centered">
          <figure class="image is-128x128">
            <img
              alt="Placeholder image"
              src="../../../_icons/512icontype11.png"
            >
          </figure>
        </div>
        <div class="content has-text-centered">
          <h1 class="title is-4">Image Parsing</h1>
          <p class="subtitle is-6">
            Generate answeer sheets and extract results from the scanned answer
            sheets.
          </p>
          <RouterLink
            class="button is-dark"
            to="generate"
          >
            <i class="material-icons">view_carousel</i>
            <span>Generate</span>
          </RouterLink>
          <RouterLink
            class="button is-dark"
            to="process"
          >
            <i class="material-icons">flash_on</i>
            <span>Process</span>
          </RouterLink>
          <br>
          <RouterLink
            class="button is-white is-fullwidth"
            to="train"
          >
            <span>Train</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style>
.hero-body {
  height: 100vh;
}
</style>
