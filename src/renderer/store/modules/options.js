const state = {
  options: {
    source: '.',
    target: '.',
    validImageFormats: [
      'png',
      'jpg',
      'jpeg',
      'jpe',
      'jfif',
      'gif',
      'tif',
      'tiff',
      'bmp',
      'dib'
    ]
  }
}

const getters = {
  validImageFormats(state) {
    return state.validImageFormats
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
