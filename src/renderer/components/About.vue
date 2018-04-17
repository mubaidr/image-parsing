<template>
  <div class="section">
    <h1 class="title">About</h1>
    <h2 class="subtitle">Developer and System information.</h2>
    <br/>
    <div class="columns">
      <div class="column is-4">
        <h2 class="subtitle is-4">Developed By</h2>
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="https://bulma.io/images/placeholders/1280x960.png"
                   alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png"
                       alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">Muhammad Ubaid Raza</p>
                <p class="subtitle is-6">@mubaidr</p>
              </div>
            </div>

            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
              <a>@bulmaio</a>.
              <a href="#">#css</a>
              <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-8">
        <h2 class="subtitle is-4">System Information</h2>
        <system-information/>
      </div>
    </div>
    <br/>
  </div>
</template>

<script>
import SystemInformation from './About/SystemInformation'

export default {
  name: 'About',
  components: { SystemInformation }
}
</script>

<style>

</style>
