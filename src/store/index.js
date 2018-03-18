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
    CreatedTickets: [],
    PurchasedTickets: [],
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
    UpdateCreatedTickets (state, updatedTickets) {
      state.CreatedTickets = updatedTickets
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
        }).post(process.env.VUE_APP_API_URL+'/Customer/login', userData)
        .then(response => {
          if (response.data.success) {
            context.commit('updateUser', response.data.user);
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
        console.log(e);
      })
      // context.commit('updateFlyers', flyerData)
    },

    loadTickets (context){
      axios.get(process.env.VUE_APP_API_URL+'/tickets/'+context.state.user.email+'/tickets').then((response) => {
        context.commit('UpdateCreatedTickets', response.data.CustomerCreatedTickets)
      })
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
      let currentPosition = "notFound"
      for (var i = 0; i < currentFlyers.length; i++) {
        if (currentFlyers[i]._id == eventData._id) {
          currentPosition = i
          currentFlyers.splice(i, 1)
        }
      }
      if (currentPosition != "notFound") {
        currentFlyers[currentPosition] = eventData
      } else {
        currentFlyers.push(eventData)
      }

      context.commit('updateEvents', currentFlyers)
    },

    UpdateCreatedTickets(context, ticketData){
        let currentFlyers = context.state.CreatedTickets
        let currentPosition = "notFound"
        console.log(ticketData._id);
        for (var i = 0; i < currentFlyers.length; i++) {
          if (currentFlyers[i]._id == ticketData._id) {
            currentPosition = i
            currentFlyers.splice(i, 1)
          }
        }
        if (currentPosition != "notFound") {
          currentFlyers[currentPosition] = ticketData
        } else {
          // console.log(currentFlyers);
          currentFlyers.push(ticketData)
        }
        context.commit('UpdateCreatedTickets', currentFlyers)
    },
    findPublicEvent(context, eventData){
      let url = process.env.VUE_APP_API_URL+'/publicEvent/'+eventData.email+'/'+eventData.eventkey
      return new Promise(
        (resolve, reject) => {
          axios.create({
            withCredentials: true
          }).get(url).then(response => {
            console.log(response);
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
        if (eventObj._id === key) {
          // console.log('inside eventobj');
          return eventObj;
        }
        /* eslint-enable no-console */
      })
    },
    PublicFlyers: state => {
      return state.events.filter(flyer => flyer.status == 'published');
    },
    customerEvents: (state, getters) => {
      if (getters.userLoggedIn) {
        return state.events.filter(flyer => flyer.publisher == state.user.email)
      } else {
        return []
      }
    },
    CreatedTicketByEvent: (state, getters) => (eventId) => {
      return state.CreatedTickets.filter(function (ticketObj) {
        if (ticketObj.eventId === eventId) {
          return true
        }
      })
    }
  }
})
