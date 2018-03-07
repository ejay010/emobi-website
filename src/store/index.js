import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  //state
  state: {
    loggedIn: "false",
    user: {},
    events: [],
    category: "entertainment",
  },
  //mutations alter state
  mutations: {
    updateLoggedIn (state, updatedStatus) {
      state.loggedIn = updatedStatus
    },
    updateUser (state, updatedUser) {
      state.user = updatedUser
    },
    updateEvents (state, updatedFlyers) {
      state.events = updatedFlyers
    },
    updateCategory (state, updatedCategory) {
      state.category = updatedCategory
    },
  },
  // actions
  actions: {
    LoginUser (context, userData) {
      // created my first promise
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).post(process.env.VUE_APP_API_URL+'/customer/login', userData)
        .then(response => {
          if (response.data.success) {
            context.commit('updateUser', response.data.user);
            // context.commit('updateUserEvents', response.data.userEvents);
            resolve({
              success: true,
              status: 200,
            })
          }
        })
        .catch(e => {
          if (e.request.status == 401) {
            reject({
              success: false,
              status: 401,
              message: "Unauthorized"
            })
          }
        })
      });
    },
    LogoutUser (context) {
      context.commit('updateUser', {})
    },
    /* eslint-disable no-console */
    loadEvents (context){
      axios.get(process.env.VUE_APP_API_URL+'/events').then(response => {
        context.commit('updateEvents', response.data)
      }).catch(e => {
      })
      // context.commit('updateFlyers', flyerData)
    },
    /* eslint-enable no-console */
    setCategory (context, category) {
      context.commit('updateCategory', category)
    },
    createEvent (context, baseData) {
      let creationData = {
        eventSeeds: baseData,
        user: context.state.user
      }
      return new Promise(
        (resolve, reject) => {
          axios.create({
            withCredentials: true
          }).post(process.env.VUE_APP_API_URL+'/createEvent', creationData).then(response => {
            resolve(response)
          }).catch(e => {
            reject(e)
          })
      });
    },

    publishEvent (context, eventID){
      let url = process.env.VUE_APP_API_URL+'/events/'+eventID+'/publish'
      return new Promise(
        (resolve, reject) => {
          axios.create({
            withCredentials: true
          }).get(url).then(response => {
            // console.log(response);
            resolve(response)
          }).catch(e => {
            reject(e)
          })
        }
      )
    },
    cancelEvent (context, eventID){
      let url = process.env.VUE_APP_API_URL+'/events/'+eventID+'/cancel'
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).get(url).then(response => {
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },

/* eslint-disable no-console */
    UpdateEvents(context, eventData){
      let currentFlyers = context.state.events
      for (var i = 0; i < currentFlyers.length; i++) {
        if (currentFlyers[i].rediskey == eventData.rediskey) {
          currentFlyers.splice(i, 1)
        }
      }
      currentFlyers.push({rediskey:eventData.rediskey, content:eventData})
      context.commit('updateEvents', currentFlyers)
    },
    findPublicEvent(context, eventData){
      let url = process.env.VUE_APP_API_URL+'/publicEvent/'+eventData.email+'/'+eventData.eventkey
      return new Promise(
        (resolve, reject) => {
          axios.create({
            withCredentials: true
          }).get(url).then(response => {
            // console.log(response);
            resolve(response)
          }).catch(e => {
            reject(e)
          })
        }
      )
    }
  },
/* eslint-enable no-console */
  //getters
  getters: {
    userLoggedIn: state => {
      if (Object.keys(state.user).length > 0) {
        return true;
      } else {
        return false;
      }
    },
    // eventCounter: state => {
    //   return state.userEvents.length;
    // },
    userEventByKey: (state, getters) => (key) => {
      return getters.customerEvents.find(function (eventObj) {
        /* eslint-disable no-console */
        if (eventObj.rediskey === key) {
          // console.log('inside eventobj');
          return eventObj;
        }
        /* eslint-enable no-console */
      })
    },
    PublicFlyers: state => {
      return state.events.filter(flyer => flyer.content.status == 'published');
    },
    customerEvents: (state, getters) => {
      if (getters.userLoggedIn) {
        return state.events.filter(flyer => flyer.content.publisher == state.user.email)
      } else {
        return null
      }
    },
  }
})
