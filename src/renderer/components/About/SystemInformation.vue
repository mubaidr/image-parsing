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
        <tr>
          <td>Vue.js</td>
          <td>{{ Vue.version }}</td>
        </tr>
        <tr
          :key="lib"
          v-for="lib in Object.keys(versions)"
        >
          <td>{{ lib }}</td>
          <td>{{ versions[lib] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable global-require */

export default {
  data() {
    return {
      versions: process.versions,
      platform: require('os').platform(),
      // vue: require('vue/package.json').version,
    }
  },
  created() {},
}
</script>

<style></style>
