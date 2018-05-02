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
        data: ''
      },
      options: {}
    },
    process: {
      source: {
        data: '.',
        design: '.'
      },
      target: {
        data: ''
      },
      options: {}
    },
    train: {
      source: {
        data: '.',
        design: '.',
        result: '.'
      },
      target: {
        data: ''
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

// reset options
store.delete('options');

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
