<template>
  <div class="block">
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <div class="navbar-burger burger">
          <span>
            <span>
              <span/>
            </span>
          </span>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <span class="navbar-link">
              <!-- <span class="icon">
                <i class="far fa-file" />
              </span> -->
              File</span>
            <div class="navbar-dropdown is-boxed">
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-file" />
                </span>
                New
              </a>
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-upload" />
                </span>
                Import
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-download" />
                </span>
                Export
              </a>
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-save" />
                </span>
                Save
              </a>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <span class="navbar-link">
              <!-- <span class="icon">
                <i class="far fa-edit" />
              </span> -->
              Edit</span>
            <div class="navbar-dropdown is-boxed">
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-undo" />
                </span>
                Undo
              </a>
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-redo" />
                </span>
                Redo
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item">
                <span class="icon">
                  <i class="fa fa-retweet" />
                </span>
                Revert
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass">
.navbar
  min-height: 0
  .navbar-brand
    min-height: 0
  span,
  a
    cursor: default

</style>
