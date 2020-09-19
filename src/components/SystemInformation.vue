<template>
  <div class="box">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Platform</td>
          <td>{{ platform }}</td>
        </tr>
        <tr v-for="lib in Object.keys(versions)" :key="lib">
          <td>{{ lib }}</td>
          <td>{{ versions[lib] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { platform } from 'os'

export default {
  data() {
    return {
      versions: process.versions,
      platform: platform(),
    }
  },
}
</script>

<style></style>
