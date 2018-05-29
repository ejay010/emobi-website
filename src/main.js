import './logger-init.js'
import Vue from 'vue'
import axios from 'axios'


import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './routes'

import Vuex from 'vuex'

Vue.use(Vuex)
import store from './store'

import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, io(process.env.VUE_APP_API_URL, {secure: true}))

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBWHQ59vmmjxOlAegYTWr0ndFIu4zyeFnE',
    libraries: 'places'
  }
})
import App from './App.vue'


// import 'requirejs'
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
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.user.user.email != null) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
  next()
})

new Vue({
  store: store,
  router: router,
  render: h => h(App)
}).$mount('#app')
