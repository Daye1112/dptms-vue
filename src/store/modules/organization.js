
const getDefaultState = () => {
  return {
    orgId: 1
  }
}

const state = getDefaultState()

const mutations = {
  SET_ORG_ID: (state, orgId) => {
    state.orgId = orgId;
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

