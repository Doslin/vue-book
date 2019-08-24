import Vue from 'vue'
import Vuex from 'vuex'
import book from './module/book'
import getters from './getter'

Vue.use(Vuex)
// 调用actions actions调用mutations mutations调用 state
export default new Vuex.Store({
  modules: {
    book
  },
  getters
})
