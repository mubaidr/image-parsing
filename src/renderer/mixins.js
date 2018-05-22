import Vue from 'vue'
import {
  mapGetters,
  mapActions
} from 'vuex'

Vue.mixin({
  computed: {
    ...mapGetters(['options'])
  },

  methods: {
    ...mapActions([
      'setOptions'
    ])
  }
})
