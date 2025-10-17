import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    user: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      console.log(user,'------store user')
      state.user = user
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        // 调用 API 登录
        api.user.login({ username, password })
          .then(response => {
            // 响应拦截器已经返回了 res.data，所以 response 就是实际数据
            commit('SET_TOKEN', response.token)
            commit('SET_USER', response.user)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        // 调用 API 登出
        api.user.logout()
          .finally(() => {
            commit('CLEAR_AUTH')
            resolve()
          })
      })
    },
    fetchUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        api.user.getUserInfo()
          .then(response => {
            console.log(response, 'response')
            commit('SET_USER', response.user)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    token: state => state.token
  }
})