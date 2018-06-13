import axios from 'axios'
export default {
  namespaced: true,
  state: {
    user: {}, //customer information
    Events: [], // customer events
    Invoices: [], // customer purchases
  },
  mutations: {
    login (state, userData) {
      state.user = userData
    },
    logOut (state, userData) {
      state.user = null
    },
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

    Invoices: (state) => {
      return state.Invoices
    }
  },
  actions: {
    // create a ticket for sale and the return to the list
    CreatedTicket (context, ticketData) {
      return new Promise(function(resolve, reject) {

      });
    },
    LoginUser (context, userData) {
      // created my first promise
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).post(process.env.VUE_APP_API_URL+'/Customer/login', userData)
        .then(response => {
          if (response.data.success) {
            console.log(response.data.user);
            context.commit('login', response.data.user);
            context.dispatch('initCustomerEvents')
            context.dispatch('initCustomerInvoices')
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
    RemoveEvent (context, eventkey){
      let currentEvents = context.state.Events
      let current_position = currentEvents.find(function(array_element) {
        if (array_element._id == eventkey) {
          return true
        }
      })
      let deleted_elements = currentEvents.splice(current_position, 1)
      if (deleted_elements.length > 0) {
        context.commit('updateEvents', currentEvents)
        return true
      } else {
        return false
      }
    },

    AddInvoice (context, invoiceData){
      let currentInvoices = context.state.Invoices
      currentInvoices.push(invoiceData)
      context.commit('updateInvoices', currentInvoices)
    },

    PublishEvent (context, eventId) {
      return new Promise(function(resolve, reject) {
        axios.create({
          withCredentials: true
        }).get(process.env.VUE_APP_API_URL + '/events/'+eventId+'/publish').then((response) => {
          context.dispatch('UpdateEvents', response.data.updatedEvent)
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
      });
    },

    CancelEvent (context, eventId) {
      return new Promise(function(resolve, reject) {
        axios.create({
          withCredentials: true
        }).get(process.env.VUE_APP_API_URL + '/events/'+eventId+'/cancel').then((response) => {
          context.dispatch('UpdateEvents', response.data.updatedEvent)
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
      });
    },

    Update (context, updateInfo) {
      return new Promise(function(resolve, reject) {
        let UpdateUrl = process.env.VUE_APP_API_URL + '/Customer/updateInfo'

        axios.create({
          withCredentials: true
        }).post(UpdateUrl, updateInfo).then((response) => {
          if (response.data.success) {
            context.commit('updateUser', response.data.user)
            resolve(response.data)
          }
        }).catch((e) => {
          reject(e)
        })
      });
    }
  }
}
