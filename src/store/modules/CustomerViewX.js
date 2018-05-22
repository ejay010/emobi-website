import axios from 'axios'
export default {
  namespaced: true,
  state: {
    user: {}, //customer information
    Events: [], // customer events
    Invoices: [], // customer purchases
  },
  mutations: {
    updateUser (state, user) {
      state.user = user
    },
    updateEvents (state, eventPayload) {
      state.Events = eventPayload
    },
    updateInvoices (state, invoicePayload) {
      state.Invoices = invoicePayload
    }
  },
  getters: {
    CreatedTickets: (state) => {
      let customerEvents = state.Events
      let ticketContainer = []
      customerEvents.forEach((events) => {
        if (events.tickets != null) {
          events.tickets.forEach((ticket) => {
            ticketContainer.push(ticket)
          })
        }
      })

      return ticketContainer
    },
    userEventByKey: (state) => (key) => {
      return state.Events.find(function (eventObj) {
        /* eslint-disable no-console */
        if (eventObj._id === key) {
          return eventObj;
        }
        /* eslint-enable no-console */
      })
    },
  },
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
              data: response.data
            })
          }
        })
        .catch(e => {
          console.log(e);
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

    initCustomerEvents (context) {
      return new Promise ((resolve, reject) => {
        let url = process.env.VUE_APP_API_URL+'/'+context.state.user.email+'/events'
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          context.commit('updateEvents', response.data.data)
          resolve(response)
        }).catch((e) => {
          reject(e)
        })
      })
    },

    initCustomerInvoices (context) {
      return new Promise ((resolve, reject) => {
        let url = process.env.VUE_APP_API_URL+'/'+context.state.user.email+'/invoices'
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          context.commit('updateInvoices', response.data.data)
          resolve(response)
        }).catch((e) => {
          reject(e)
        })
      })
    },

    deleteCustomerInvoice (context, invoice_id)  {
      return new Promise ((resolve, reject) => {
        let url = process.env.VUE_APP_API_URL + '/invoice/' + invoice_id + '/delete'
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          //success
          if (response.data.success) {
            let current_invoices = context.state.Invoices
            let index_position = current_invoices.findIndex((element) => {
              if (element._id == invoice_id) {
                return true
              }
              return false
            })

            if (index_position != -1) {
              context.state.Invoices.splice(index_position, 1)
            }
            resolve({
              success: true,
              message: "Invoice Deleted"
            })
          }
        }).catch( (e) => {
          reject(e)
        })
      })
    },

    UpdateEvents(context, eventData){
      let currentFlyers = context.state.Events
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
  }
}
