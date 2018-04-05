<template>
  <div>
    <div class="header-background">
      <section class="hero is-dark is-medium">
        <!-- Hero content: will be in the middle -->
        <div class="hero-body">
          <div class="container has-text-centered">
            <h1 class="title is-1">
              Image Parsing
            </h1>
            <p>Design, populate and extract results from the answer sheets. </p>
          </div>
        </div>
        <router-link to="/about">About</router-link>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'landing-page'
}
</script>

<style>
.header-background {
  background: rgb(255, 255, 255); /* Old Browsers */
  background: -webkit-radial-gradient(
    center,
    rgb(255, 255, 255),
    rgb(0, 122, 205)
  ); /*Safari 5.1-6*/
  background: -o-radial-gradient(
    center,
    rgb(255, 255, 255),
    rgb(0, 122, 205)
  ); /*Opera 11.1-12*/
  background: -moz-radial-gradient(
    center,
    rgb(255, 255, 255),
    rgb(0, 122, 205)
  ); /*Fx 3.6-15*/
  background: radial-gradient(
    ellipse at center,
    rgb(255, 255, 255),
    rgb(0, 122, 205)
  ); /*Standard*/
}
</style>
