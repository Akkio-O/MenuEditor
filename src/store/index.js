import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
      isRole: localStorage.getItem('userRole') || null,
    };
  },
  mutations: {
    SET_AUTHENTICATED(state, status) {
      state.isAuthenticated = status;
      localStorage.setItem('isAuthenticated', JSON.stringify(status));
    },
    SET_ROLE(state, role) {
      state.isRole = role;
      localStorage.setItem('userRole', role);
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
