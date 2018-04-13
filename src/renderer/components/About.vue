<template>
  <div class="section">
    <h1 class="title">About</h1>
    <router-link to="/">Go back</router-link>
    <hr>
    <h2 class="subtitle is-3">Developed By</h2>
    <p>Blah, blah & blah</p><hr>
    <system-information/>
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
