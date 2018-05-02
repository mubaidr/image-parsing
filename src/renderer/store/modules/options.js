const Store = require('electron-store');
const store = new Store();

const _defaults = {
  options: {
    design: {
      options: {}
    },
    generate: {
      source: {
        data: '.',
        design: '.'
      },
      target: {
        data: '',
        design: ''
      },
      options: {}
    },
    process: {
      source: {
        data: '.',
        design: '.'
      },
      target: {
        data: '',
        design: ''
      },
      options: {}
    },
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
        // 'dib'
      ],
      design: [
        'json',
        'svg'
      ],
      excel: [
        // 'xls',
        'xlsx',
        'xlsm',
        'csv'
      ]
    }
  }
}

const opt = store.get('options')
const state = opt ? {
  options: opt
} : _defaults

const getters = {
  options(state) {
    return state.options
  }
}

const mutations = {
  setOptions(state, opt) {
    state.options = opt
  }
}

const actions = {
  setOptions(context, opt) {
    context.commit('setOptions', opt)

    store.set('options', opt)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
