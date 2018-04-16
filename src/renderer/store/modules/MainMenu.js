const state = {
  mainMenu: [{
      path: '/',
      name: 'Home',
      active: true,
      icon: 'fa-home'
    },
    {
      path: '/design',
      name: 'Design Answer Sheet',
      active: false,
      icon: 'fa-object-group'
    },
    {
      path: '/generate',
      name: 'Generate Answer Sheets',
      active: false,
      icon: 'fa-file-alt'
    },
    {
      path: '/process',
      name: 'Process Scanned Files',
      active: false,
      icon: 'fa-play'
    },
    {
      path: '/about',
      name: 'About',
      active: false,
      icon: 'fa-info-circle'
    }
  ]
}

const getters = {
  allSteps(state) {
    return state.mainMenu
  },
  activeStep(state) {
    return state.mainMenu.filter(item => item.active ===
      true)[0]
  }
}

const mutations = {
  SET_ACTIVE_STEP(state, path) {
    state.mainMenu.forEach(item => {
      if (item.path === path) {
        item.active = true
      } else {
        item.active = false
      }
    })
  }
}

const actions = {
  setActiveStep(context, path) {
    context.commit('SET_ACTIVE_STEP', path)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
