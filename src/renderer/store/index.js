import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    compiledResult: undefined,
  },

  // getters: {},

  // mutations: {},

  actions: {
    setCompiledResult(context, compiledResult) {
      context.state.compiledResult = compiledResult
    },
  },
})

export default store
