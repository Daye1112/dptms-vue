import request from '@/utils/request'
import {fileView} from '@/utils/file'
import {removeAccessToken, removeRefreshToken, removeVuex} from '@/utils/auth'

const getDefaultState = () => {
  return {
    userInfo: '',
    menuList: [],
    menuCodeList: [],
    orgList: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    userInfo.fileId && (userInfo.fileUrl = fileView(userInfo.fileId));
    state.userInfo = userInfo
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList;
  },
  SET_MENU_CODE_LIST: (state, menuCodeList) => {
    state.menuCodeList = menuCodeList;
  },
  SET_ORG_LIST: (state, orgList) => {
    state.orgList = orgList;
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  }
}

const actions = {
  // 登录
  login({commit, dispatch}, userInfo) {
    return new Promise((resolve, reject) => {
      request.post("/auth/login", userInfo)
        .then(response => {
          // 获取用户信息
          const {data} = response;
          commit('SET_USER_INFO', data);
          resolve(data);
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      request.get("/auth/activeUser/getInfo")
        .then(response => {
          // 获取用户信息
          const {data} = response;
          commit('SET_USER_INFO', data);
          resolve(data);
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getMenuList({commit}) {
    return new Promise((resolve, reject) => {
      request.get("/auth/activeUser/listMenu")
        .then(response => {
          const {data} = response;
          let menuList = data;
          let menuCodeList = menuList.map(item => item.menuCode);
          // 获取用户的菜单权限
          commit('SET_MENU_LIST', menuList);
          commit('SET_MENU_CODE_LIST', menuCodeList);
          resolve(data);
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getOrgList({commit}) {
    return new Promise((resolve, reject) => {
      request.get("/auth/activeUser/listOrg")
        .then(response => {
          const {data} = response;
          data.unshift({id: 0, orgName: '默认组织'});
          commit('SET_ORG_LIST', data);
          resolve(data);
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  resetToken({commit}) {
    return new Promise(resolve => {
      // 移除token
      removeAccessToken();
      removeRefreshToken();
      commit('RESET_STATE'); // 重置状态
      resolve();
    })
  },
  logout({commit}) {
    return new Promise((resolve, reject) => {
      request.get("/auth/logout")
        .then(() => {
          commit('RESET_STATE');
          // 删除sessionStorage
          removeVuex();
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

