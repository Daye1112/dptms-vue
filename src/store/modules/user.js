import {axiosPost} from '@/utils/request'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    userInfo: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // 登录
  login({commit, dispatch}, userInfo) {
    return new Promise((resolve, reject) => {
      axiosPost("/auth/login", userInfo)
        .then(response => {
          // 获取用户信息
          commit('SET_USER_INFO', response.data);
          resolve();
        })
        .catch(error => {
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

