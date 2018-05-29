import axios from 'axios'
export default {
  namespaced: true,
  state: {
    flyer: {},
    publishedEvents: []
  },
  mutations: {
    setFlyer (state, newflyer) {
      state.flyer = newflyer
    },
    setPublishedEvents (state, eventsArray) {
      state.publishedEvents = eventsArray
    }
  },
  actions: {
    findPublicEvent (context, eventData) {
      let url = process.env.VUE_APP_API_URL+'/publicEvent/'+eventData.email+'/'+eventData.eventkey
      axios.create({
        withCredentials: true
      }).get(url).then((response) => {
        context.commit('setFlyer', response.data)
      })
    },

    SaleNotice (context, saleData) {
      let currentTickets = context.state.flyer.tickets
      let ticketPosition = currentTickets.findIndex(function (element) {
        if (element._id == saleData.ticketId) {
          return true
        }
        return false
      })

      let ticketObj = currentTickets[ticketPosition]
      ticketObj.qty_sold = ticketObj.qty_sold + saleData.qty
      ticketObj.quantity_available = ticketObj.quantity_available - saleData.qty

    },
    Create (context, seedData) {
      return new Promise((resolve, reject) => {
        let userData = context.rootState.user.user
        axios.create({
          withCredentials: true
        }).post(process.env.VUE_APP_API_URL + '/createEvent', {
          eventSeeds: seedData,
          user: userData
        }).then((response) => {
          resolve(response)
        }).catch((e) => {
          reject(e)
        })
      }) ;
    },

    Delete (context, eventId) {
      return new Promise ((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).get(process.env.VUE_APP_API_URL + '/events/'+ eventId +'/delete').then((response) => {
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
      })
    },

    loadPublished (context) {
      axios.get(process.env.VUE_APP_API_URL + '/events/published').then((response) => {
        context.commit('setPublishedEvents', response.data)
      })
    }
  },

  getters: {
    tickets (state) {
      if (state.flyer.tickets != null) {
        if (state.flyer.tickets.length > 0) {
          return state.flyer.tickets
        } else {
          return []
        }
      } else {
        return []
      }
    },
    flyerImg (state) {
      if (state.flyer.flyer) {
        let flyerImg = JSON.parse(state.flyer.flyer)
        flyerImg.src = process.env.VUE_APP_API_URL + '/' + flyerImg.filename + '-' + flyerImg.originalname

        return flyerImg
      }
      return null
    },
  }
}
