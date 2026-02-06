// import { set } from 'core-js/core/dict'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isLoggedIn: false,
    cartCount: 0,
    searchQuery: '',
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isLoggedIn = true
    },

    LOGOUT(state) {
      state.user = null
      state.isLoggedIn = false
    },
    setCartCount(state, count) {
      state.cartCount = count
    },
    setSearchQuery(state, query) {
    state.searchQuery = query;
  }
  }
})
