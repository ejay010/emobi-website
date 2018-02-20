import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './routes'

import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store'

import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, io('http://:3000'))

import App from './App.vue'

import 'jquery'
import 'bootstrap'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
Vue.component('icon', Icon)

Vue.config.productionTip = false

const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
})

new Vue({
  store: store,
  router: router,
  render: h => h(App)
}).$mount('#app')

/* eslint-disable no-console */
console.log(router.app);
/* eslint-enable no-console */
