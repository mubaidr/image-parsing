<template>
  <div>
    <section class="hero is-dark is-bold">
      <div class="hero-body">
        <br />
        <div class="block has-text-centered">
          <figure class="image is-128x128">
            <img
              alt="Placeholder image"
              src="../../../_icons/512icontype11.png"
            />
          </figure>
        </div>

        <div class="content has-text-centered">
          <h1 class="title is-4">
            Image Parsing
          </h1>
          <p class="subtitle is-6">
            A complete solution for Forms/MCQ based paper checking.
          </p>

          <!-- <br /> -->

          <div class="buttons is-centered">
            <RouterLink class="button is-light" to="/generate/answer-sheets">
              <i class="material-icons">print</i>
              <span>Generate</span>
            </RouterLink>
            <RouterLink class="button is-light" to="/process/extract">
              <i class="material-icons">list</i>
              <span>Extract</span>
            </RouterLink>
            <RouterLink class="button is-light" to="/process/review">
              <i class="material-icons">playlist_add_check</i>
              <span>Review</span>
            </RouterLink>
            <RouterLink class="button is-light" to="compile">
              <i class="material-icons">assessment</i>
              <span>Compile</span>
            </RouterLink>
            <RouterLink class="button is-light" to="/utilities/train">
              <i class="material-icons">build</i>
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
  min-height: 100vh;
  height: 100%;
}
</style>
