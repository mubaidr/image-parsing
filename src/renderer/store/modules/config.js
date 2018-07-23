const state = {
  config: {
    validFormats: {
      image: [
        'png',
        'jpg',
        'jpeg',
        'jpe',
        // 'jfif',
        'gif',
        'tif',
        'tiff',
        'bmp',
        // 'dib',
      ],
    },
  },
}

/* eslint-disable */
const getters = {
  config(state) {
    return state.config
  },
}

const mutations = {}

const actions = {}
/* eslint-enable */

export default {
  state,
  getters,
  mutations,
  actions,
}
