<template>
  <div>
    <section class="hero is-light">
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
        </div>
        <br>
        <div class="columns">
          <div class="column is-3 is-offset-3">
            <RouterLink
              class="button is-dark is-fullwidth"
              to="generate"
            >
              <span class="icon">
                <i class="fa fa-file-alt"/>
              </span>
              <span>Generate</span>
            </RouterLink>
          </div>
          <div class="column is-3">
            <RouterLink
              class="button is-dark is-fullwidth"
              to="process"
            >
              <span class="icon">
                <i class="fa fa-play"/>
              </span>
              <span>Process</span>
            </RouterLink>
          </div>
        </div>

        <div class="columns">
          <div class="column is-2 is-offset-5">
            <RouterLink
              class="button is-white is-small is-fullwidth"
              to="train"
            >
              <span class="icon">
                <i class="fa fa-cogs"/>
              </span>
              <span>Train</span>
            </RouterLink>
          </div>
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
