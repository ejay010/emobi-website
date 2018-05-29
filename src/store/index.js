import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import VuexPersist from 'vuex-persist'

import EventViewX from './modules/EventViewX.js'
import CustomerViewX from '../store/modules/CustomerViewX.js'

let whitelistMutations = [
  'user/login',
  'user/logOut',
  'user/updateEvents',
  'user/updateInvoices'
]
const vuexLocalStorage = new VuexPersist({
  key: 'emobie',
  storage: window.sessionStorage,
  modules: ['user'],
  filter: (mutation) => {
    console.log(mutation.type);
    return (whitelistMutations.indexOf(mutation.type) != -1)}
})

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  modules: {
    events: EventViewX,
    user: CustomerViewX
  },
  //main-state
  state: {
    // PublicEvents: [],
    category: "entertainment",
  },
  //mutations alter state
  mutations: {
    updateLoggedIn (state, updatedStatus) {
      state.loggedIn = updatedStatus
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
    init (context) {
      context.dispatch('events/loadPublished')
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
