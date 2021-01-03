import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import user from './modules/user'
import permission from './modules/permission'
import organization from './modules/organization'
import VuexPersistence from 'vuex-persist' // 持久化存储

Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  modules: []
})
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    user,
    permission,
    organization
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
