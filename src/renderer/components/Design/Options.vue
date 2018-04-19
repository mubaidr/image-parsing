<template>
  <div class="box no-padding">
    <div class="buttons has-addons">
      <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <button class="button is-white is-small"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu">
            <span>Design</span>
            <span class="icon">
              <i class="fas fa-angle-down"
                 aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu"
             role="menu">
          <div class="dropdown-content">
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-file" />
              </span>
              New
            </a>
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-upload" />
              </span>
              Import
            </a>
            <hr class="dropdown-divider">
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-download" />
              </span>
              Export
            </a>
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-save" />
              </span>
              Save
            </a>
          </div>
        </div>
      </div>

      <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <button class="button is-white is-small"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu">
            <span>Edit</span>
            <span class="icon">
              <i class="fas fa-angle-down"
                 aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu"
             role="menu">
          <div class="dropdown-content">
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-undo" />
              </span>
              Undo
            </a>
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-redo" />
              </span>
              Redo
            </a>
            <hr class="dropdown-divider">
            <a class="dropdown-item">
              <span class="icon">
                <i class="fa fa-retweet" />
              </span>
              Revert
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="sass">
.no-padding
  padding: 0
.buttons
  & .dropdown-trigger
    .button
      padding: 0 0.5rem
      border-color: transparent
</style>
