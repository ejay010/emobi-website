import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import EventViewX from './modules/EventViewX.js'
import CustomerViewX from '../store/modules/CustomerViewX.js'

export default new Vuex.Store({
  modules: {
    EventView: EventViewX,
    user: CustomerViewX
  },
  //main-state
  state: {
    loggedIn: "false",
    PublicEvents: [],
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
    updatePublicEvents (state, updatedFlyers) {
      state.PublicEvents = updatedFlyers
    },
    UpdateCreatedTickets (state, updatedTickets) {
      state.CreatedTickets = updatedTickets
    },
    updateCategory (state, updatedCategory) {
      state.category = updatedCategory
    },
    UpdatePurchasedTickets (state, updatedTickets) {
      state.PurchasedTickets = updatedTickets
    }
  },
  // actions
  actions: {
    RemoveEvent (context, eventkey){
      let currentEvents = context.state.events
      let current_position = currentEvents.find(function(array_element) {
        if (array_element._id == eventkey) {
          return true
        }
      })
      let deleted_elements = currentEvents.splice(current_position, 1)
      if (deleted_elements.length > 0) {
        context.commit('updateEvents', currentEvents)
      }
    },
    LogoutUser (context) {
      context.commit('updateUser', {})
    },
    /* eslint-disable no-console */
    loadEvents (context){
      axios.get(process.env.VUE_APP_API_URL+'/events').then(response => {
        context.commit('updatePublicEvents', response.data)
      }).catch(e => {
        console.log(e);
      })
    },

    /* eslint-enable no-console */
    setCategory (context, category) {
      context.commit('updateCategory', category)
    },

/* eslint-disable no-console */

    UpdateCreatedTickets(context, ticketData){
        let currentFlyers = context.state.CreatedTickets
        let currentPosition = "notFound"
        for (var i = 0; i < currentFlyers.length; i++) {
          if (currentFlyers[i]._id == ticketData._id) {
            currentPosition = i
            currentFlyers.splice(i, 1)
          }
        }
        if (currentPosition != "notFound") {
          currentFlyers[currentPosition] = ticketData
        } else {
          currentFlyers.push(ticketData)
        }
        context.commit('UpdateCreatedTickets', currentFlyers)
    },

    UpdatePurchasedTickets(context, ticketData){
          let currentFlyers = context.state.PurchasedTickets
          let currentPosition = "notFound"
          for (var i = 0; i < currentFlyers.length; i++) {
            if (currentFlyers[i]._id == ticketData._id) {
              currentPosition = i
              currentFlyers.splice(i, 1)
            }
          }
          if (currentPosition != "notFound") {
            currentFlyers[currentPosition] = ticketData
          } else {
            currentFlyers.push(ticketData)
          }
          context.commit('UpdatePurchasedTickets', currentFlyers)
    },
    // findPublicEvent(context, eventData){
    //   let url = process.env.VUE_APP_API_URL+'/publicEvent/'+eventData.email+'/'+eventData.eventkey
    //   return new Promise(
    //     (resolve, reject) => {
    //       axios.create({
    //         withCredentials: true
    //       }).get(url).then(response => {
    //         resolve(response)
    //       }).catch(e => {
    //         reject(e)
    //       })
    //     }
    //   )
    // },

    DeleteEventTicket (context, ticket) {
      let url = process.env.VUE_APP_API_URL+'/events/'+ticket.eventId+'/ticket/'+ticket._id+'/deleteTicket'
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).get(url).then(response => {
          resolve (response)
        }).catch(e => {
          reject (e)
        })
      })
    },

    DropEventTicket (context, ticket) {
      let current_tickets = context.state.CreatedTickets
      let current_ticket_position = current_tickets.findIndex((element) => {
        if (element._id == ticket._id) {
          return true
        } else {
          return false
        }
      })

      if (current_ticket_position != -1) {
        current_tickets.splice(current_ticket_position, 1)
        context.commit('UpdateCreatedTickets', current_tickets)
        return {
          success: true,
        }
      } else {
        return {
          success: false
        }
      }
    }
  },
/* eslint-enable no-console */
  //getters
  getters: {
    userLoggedIn: state => {
      if (Object.keys(state.user.user).length > 0) {
        return true;
      } else {
        return false;
      }
    },
    // eventCounter: state => {
    //   return state.userEvents.length;
    // },

    PublicFlyers: state => {
      return state.PublicEvents.filter(flyer => flyer.status == 'published');
    },
    // customerEvents: (state, getters) => {
    //   if (getters.userLoggedIn) {
    //     return state.PublicEvents.filter(flyer => flyer.publisher == state.user.email)
    //   } else {
    //     return []
    //   }
    // },
    CreatedTicketByEvent: (state, getters) => (eventId) => {
      return state.CreatedTickets.filter(function (ticketObj) {
        if (ticketObj.eventId === eventId) {
          return true
        }
      })
    },
    Purchases: (state) => {
      return state.PurchasedTickets
    }
  }
})
