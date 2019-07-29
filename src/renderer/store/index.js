import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    compiledResult: null,
  },

  // getters: {},

  // mutations: {},

  actions: {
    setCompiledResult(context, compiledResult) {
      context.state.compiledResult = compiledResult
    },

    clearCompiledResult ( context ) {
      context.state.compiledResult = null
    }
  },
})

export default store
