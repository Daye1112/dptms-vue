import {asyncRoutes, constantRoutes} from '@/router/router'
import Main from '@/views/Main'

function copyExpectChildren(obj) {
  const temp = {...obj}
  delete temp.children
  temp.children = []
  return temp
}

export function filterAsyncRoutes(node, permissions) {
  if (node.children) {
    const tempNode = copyExpectChildren(node);
    node.children.forEach(childNode => {
      const obj = filterAsyncRoutes(childNode, permissions);
      if (obj.result) {
        tempNode.children.push(obj.node);
      }
    })
    return {
      result: tempNode.children.length > 0,
      node: tempNode
    }
  } else {
    // 叶节点
    // const result = permissions.includes(node.meta.permission)
    const result = true;
    return {
      result,
      node
    }
  }
}

const state = {
  allRoutes: [],
  mainChildrenRoutes: [],
  mainRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.mainRoutes = routes;
    state.mainChildrenRoutes = routes[0].children;
    state.allRoutes = constantRoutes.concat(routes);
  }
}

const actions = {
  generateRoutes({commit}, permissions) {
    return new Promise(resolve => {
      // 包装路由
      const wrapRoutes = {
        children: [...asyncRoutes]
      };
      // 递归添加动态路由
      const routes = filterAsyncRoutes(wrapRoutes, permissions);
      // 解包路由
      const accessRoutes = routes.node.children;
      let mainRoutes = [{
        path: '/main',
        name: 'main',
        component: Main
      }];
      mainRoutes[0].children = accessRoutes;
      commit('SET_ROUTES', mainRoutes);
      resolve(mainRoutes);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
