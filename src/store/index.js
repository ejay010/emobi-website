import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  //state
  state: {
    loggedIn: "false",
    user: {},
    flyers: [],
    category: "entertainment",
    userEvents: [],
  },
  //mutations alter state
  mutations: {
    updateLoggedIn (state, updatedStatus) {
      state.loggedIn = updatedStatus
    },
    updateUser (state, updatedUser) {
      state.user = updatedUser
    },
    updateFlyers (state, updatedFlyers) {
      state.flyers = updatedFlyers
    },
    updateCategory (state, updatedCategory) {
      state.category = updatedCategory
    },
    addToUserEvents (state, newEvent){
      state.userEvents.push(newEvent)
    },
    updateUserEvents (state, events){
      state.userEvents = events
    }
  },
  // actions
  actions: {
    /* eslint-disable no-console */
    alertUser (context, alertData){
      console.log(alertData);
    },
    /* eslint-enable no-console */
    LoginUser (context, userData) {
      // created my first promise
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).post('http://:3000/customerLogin', userData)
        .then(response => {
          if (response.data.success) {
            context.commit('updateUser', response.data.user);
            context.commit('updateUserEvents', response.data.userEvents);
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
    loadFlyers (context){
      axios.get('http://:3000/events').then(response => {
        context.commit('updateFlyers', response.data.data)
      }).catch(e => {
        console.log(e.message);
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
          }).post('http://:3000/createEvent', creationData).then(response => {
            resolve(response)
          }).catch(e => {
            reject(e)
          })
      });
    },

/* eslint-disable no-console */
    updateUserEvents (context, rawData) {
      console.log(rawData);
      let formatedData = {
        rediskey: rawData.redis.key,
        content: rawData.redis.data
      }
      context.commit('addToUserEvents', formatedData)
    },
/* eslint-enable no-console */
    publishEvent (context, eventID){
      let url = 'http://:3000/event/'+eventID+'/publish'
      return new Promise(
        (resolve, reject) => {
          axios.create({
            withCredentials: true
          }).get(url).then(response => {
            resolve(response)
          }).catch(e => {
            reject(e)
          })
        }
      )
    },
    cancelEvent (context, eventID){
      let url = 'http://:3000/event/'+eventID+'/cancel'
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
    PublishPublicEvent(context, eventData){
      let currentFlyers = context.state.flyers
        currentFlyers.push(eventData)
        context.commit('updateFlyers', currentFlyers)
    },

    CancelPublicEvent(context, eventData){
      let currentFlyers = context.state.flyers
      if (currentFlyers.length > 0) {
        for (var i = 0; i < currentFlyers.length; i++) {
          if (currentFlyers[i].rediskey == eventData.rediskey) {
            currentFlyers.splice(i, 1)
          }
        }
        context.commit('updateFlyers', currentFlyers)
      }
    },

    UpdatePublicEvent(context, eventData){
      let currentFlyers = context.getters.PublicFlyers
      for (var i = 0; i < currentFlyers.length; i++) {
        if (currentFlyers[i].rediskey == eventData.rediskey) {
          currentFlyers.splice(i, 1)
        }
      }
      currentFlyers.push(eventData)
      context.commit('updateFlyers', currentFlyers)
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
    eventCounter: state => {
      return state.userEvents.length;
    },
    userEventByKey: (state) => (key) => {
      return state.userEvents.find(function (eventObj) {
        /* eslint-disable no-console */
        // console.log(key);
        // console.log(eventObj);
        // console.log(eventObj.rediskey);
        if (eventObj.rediskey === key) {
          // console.log('inside eventobj');
          return eventObj;
        }
        /* eslint-enable no-console */
      })
    },
    PublicFlyers: state => {
      return state.flyers;
    }
  }
})
