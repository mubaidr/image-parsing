<template>
  <div>
    <div class="colums">
      <div class="column is-10 is-offset-1">
        <div class="box">
          <h1 class="title">About</h1>
          <router-link to="/">Go back</router-link>
          <hr/>
          <h2 class="subtitle is-3">Developed By</h2>
          <p>Blah, blah & blah</p><hr/>
          <system-information></system-information>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemInformation from './About/SystemInformation'

export default {
  name: 'about',
  components: { SystemInformation }
}
</script>

<style>

</style>
