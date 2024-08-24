import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      isAuthenticated: false,
      isRole: null,
    };
  },
  mutations: {
    SET_AUTHENTICATED(state, status) {
      state.isAuthenticated = status;
    },
    SET_ROLE(state, role) {
      state.isRole = role;
    },
  },
  actions: {
    setAuthenticated({ commit }, status) {
      commit('SET_AUTHENTICATED', status);
    },
    setRole({ commit }, role) {
      commit('SET_ROLE', role);
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentRole: state => state.isRole,
  },
});
