<template>
  <div class="menu-bar">
    <div class="left">
      <ul>
        <li>File</li>
        <li>Edit</li>
        <li>About</li>
      </ul>
    </div>

    <div class="mid">
      <span>Image Parsing</span>
    </div>

    <div class="right">
      <ul>
        <li><i class="far fa-window-minimize"/></li>
        <li><i class="far fa-window-restore"/></li>
        <li><i class="fas fa-close"/></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [],
    }
  },
  created() {
    this.routes = this.$router.options.routes.filter(
      route =>
        route.path !== '*' && route.path !== '/' && route.path !== '/train',
    )
  },
  methods: {
    toggleNavigationView() {
      this.isNavBarWide = !this.isNavBarWide
    },
  },
}
</script>

<style lang="sass">

.menu-bar
  font-size: 0.8em
  background-color: #fff
  border-radius: 2px 2px 0 0
  height: 30px
  div
    display: inline-flex
    &.mid
      flex: 2
      span
        -ms-overflow-style: scrollbar
        -webkit-app-region: drag
        text-align: center
        padding: 5px
        width: 100%
        text-overflow: ellipsis
  .column:last-child
    text-align: right
  ul
    width: 100%
    cursor: default
    li
      display: inline-block
      padding: 5px 10px
      text-align: center
      &:hover
        background-color: #eee
      &:active
        background-color: #ddd

.menu-bar
  input[type="submit"],
  input[type="reset"],
  input[type="button"],
  input[type="text"],
  input[type="radio"],
  input[type="checkbox"],
  select,
  button,
  textarea,
  a,
  button
    -webkit-app-region: no-drag
  h1, h2, h3, h4, h5, h6
    -webkit-user-select: none

</style>
