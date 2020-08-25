<template>
  <div>
    <section class="hero is-dark is-bold">
      <div class="hero-body">
        <br />
        <div class="block has-text-centered">
          <figure class="image is-128x128">
            <img alt="Product Logo" src="@/assets/icon.png" />
          </figure>
        </div>

        <div class="content has-text-centered">
          <h1 class="title is-4">Image Parsing</h1>
          <p class="subtitle is-6">
            A complete solution for Forms/MCQ based paper checking.
          </p>

          <div class="buttons is-centered">
            <RouterLink class="button is-primary" to="/generate/answer-sheets">
              <i class="material-icons">print</i>
              <span>Generate</span>
            </RouterLink>
            <RouterLink class="button is-primary" to="/process/extract">
              <i class="material-icons">list</i>
              <span>Extract</span>
            </RouterLink>
            <RouterLink class="button is-primary" to="/process/review">
              <i class="material-icons">playlist_add_check</i>
              <span>Review</span>
            </RouterLink>
            <RouterLink class="button is-primary" to="compile">
              <i class="material-icons">assessment</i>
              <span>Compile</span>
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
