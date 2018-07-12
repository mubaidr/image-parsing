<template>
  <div class="section">
    <h1 class="title">About</h1>
    <br>
    <h2 class="subtitle is-4">Developed By</h2>
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <strong>Muhammad Ubaid Raza</strong>
              <a
                href="//github.com/mubaidr"
                target="_blank">@mubaidr</a>
              <br>
              Full Stack Web Developer: Jack of all trades, master of "some".
            </p>
          </div>
        </div>
      </article>
    </div>

    <h2 class="subtitle is-4">System Information</h2>
    <system-information/>
    <br>
  </div>
</template>

<script>
import SystemInformation from './About/SystemInformation.vue'

export default {
  name: 'About',
  components: { SystemInformation },
}
</script>

<style>
.block.has-text-centered figure {
  margin: 0 auto;
}
</style>
