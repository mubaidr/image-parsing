const Store = require('electron-store');
const store = new Store();

const _defaults = {
  options: {
    design: {
      options: {}
    },
    generate: {
      source: {
        excel: '.',
        design: '.'
      },
      target: {
        data: ''
      },
      options: {}
    },
    process: {
      source: {
        image: '.',
        design: '.'
      },
      target: {
        data: ''
      },
      options: {}
    },
    train: {
      source: {
        image: '.',
        design: '.',
        excel: '.'
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
// store.delete('options');

const state = {}
const opt = store.get('options')

if (opt && opt.design && opt.generate && opt.process) {
  state.options = opt
} else {
  state.options = _defaults.options

  store.set('options', _defaults.options)
}

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
