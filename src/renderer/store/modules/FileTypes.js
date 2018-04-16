const state = {
  validTypes: ['jpg', 'jpeg', 'jpe', 'png', 'bmp', 'tif', 'tiff']
}

const getters = {
  validFileTypes(state) {
    return state.validTypes
  }
}

const mutations = {}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
