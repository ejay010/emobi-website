import axios from 'axios'
export default {
  state: {
    flyer: {}
  },
  mutations: {
    setFlyer (state, newflyer) {
      state.flyer = newflyer
    },
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
