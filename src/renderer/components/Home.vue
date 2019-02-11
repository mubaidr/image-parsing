<template>
  <div>
    <section class="hero is-info">
      <div class="hero-body">
        <br />
        <div class="block has-text-centered">
          <figure class="image is-128x128">
            <img
              src="../../../IconDesigns/512icontype11.png"
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div class="content has-text-centered">
          <h1 class="title is-1">
            Image Parsing
          </h1>
          <p class="subtitle is-5">
            Generate answeer sheets and extract results from the scanned answer
            sheets.
          </p>
        </div>
        <br />
        <div class="columns">
          <div class="column is-3 is-offset-3">
            <RouterLink to="generate" class="button is-primary is-fullwidth">
              <span class="icon">
                <i class="fa fa-file-alt" />
              </span>
              <span>Generate</span>
            </RouterLink>
          </div>
          <div class="column is-3">
            <RouterLink to="process" class="button is-primary is-fullwidth">
              <span class="icon">
                <i class="fa fa-play" />
              </span>
              <span>Process</span>
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
