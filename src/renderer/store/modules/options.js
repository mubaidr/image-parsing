const state = {
  options: {
    source: '.',
    target: '.',
    imageFormats: [
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
  validFileTypes(state) {
    return state.imageFormats
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
