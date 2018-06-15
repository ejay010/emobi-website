<template>
<span>
  <div class="container-fluid p-3">
    <div class="row">
        <div class="col-md">
          <div class="card">
            <img class="card-img-top" v-bind:src="flyerImg" />
            <div class="card-body">
              <h2 class="card-title">{{flyer.title}}</h2>
              <p class="card-text">
                <dl>
                  <dt>
                    Start
                  </dt>
                  <dd>
                    {{StartTime}}
                  </dd>
                  <dt>
                    Finish
                  </dt>
                  <dd>
                    {{finishTime}}
                  </dd>
                  <dt>
                    Description
                  </dt>
                  <dd>
                    {{flyer.description}}
                  </dd>
                </dl>
              </p>
            </div>
          </div>
        </div>

        <div class="col-sm-4">
          <div class="card">
              <div class="card-header">
                  <h5>Location</h5>
              </div>
              <div class="card-body">
                  <googleMap :showAutoComplete="false" :mapStyle="mapStyle" :MapMarker="locationData" :zoom="10"></googleMap>
              </div>
          </div>

          <div class="card">
              <div class="card-header">
                  <h5>Tickets</h5>
              </div>
              <div class="card-body"  v-if="tickets.length == 0">
                    <p>None Avaiable</p>
                  </div>
                    <div class="list-group" v-else>
                        <a class="list-group-item list-group-item-action" v-for="ticket in tickets" :key="ticket._id" v-on:click="openPurchaseDiag(ticket)">
                          <div class="media">
                              <div class="media-body">
                                <h5 class="mt-0">{{ticket.title}} | <small>{{ticket.paid_or_free}}</small></h5>
                                <!-- <button class="btn btn-default" >Purchase</button> -->
                              </div>
                          </div>
                            <p>Qty Avail: {{ticket.quantity_available}}</p>
                            <p>{{ticket.description}}</p>
                        </a>
                    </div>
              </div>
        </div>
    </div>
    </div>
  </div>
  <TicketGrappler :purchase="intendedPurchase"></TicketGrappler>

<div class="modal" tabindex="-1" role="dialog" id="loginDiag">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sign In Or Register</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-content">
  <button class="btn btn-primary" @click="moveToSignIn">Sign In</button>
  <button class="btn btn-secondary" @click="moveToRegister">Register</button>
</div>
</div>
</div>
</div>
</span>
</template>

<style>
.button-loader {
  display: inline;
}
</style>

<script>
import Loader from 'vue-spinner/src/PulseLoader.vue'
import googleMap from './Utilities/GoogleMapComponent.vue'
import swal from 'sweetalert2'
import moment from 'moment'
import axios from 'axios'
import TicketGrappler from './Utilities/TicketGrappler.vue'
import $ from 'jquery'
export default {
  components: {
    Loader,
    googleMap,
    TicketGrappler
  },
  data() {
    return {
      mapStyle: {
        width: '100%',
        height: '400px'
      },
      loading: false,
      loaderColor: '#fff',
      loaderSize: '6px',
      intendedQty: 1,
      initTicketGrappler: false,
      intendedPurchase: {
        ticket: {},
        eventId: "",
        purchaser: "",
      }
    }
  },
  created: function() {
    this.$store.dispatch('events/findPublicEvent', this.$route.params)
  },
  computed: {
    flyer() {
      return this.$store.state.events.flyer
    },
    tickets() {
      return this.$store.getters['events/tickets']
    },
    flyerImg() {
      if (this.$store.getters['events/flyerImg'] != null) {
        return this.$store.getters['events/flyerImg'].src
      }
      return "#"
    },
    StartTime() {
      return moment.utc(this.flyer.startTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    finishTime() {
      return moment.utc(this.flyer.finishTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    locationData() {
      if (this.flyer.location != null) {
        return JSON.parse(this.flyer.location)
      } else {
        return {
          geometry: {
            lat: 25.06,
            lng: -77.345
          }
        }
      }
    },
  },
  methods: {
    moveToSignIn: function() {
      $('#loginDiag').modal('hide')
      this.$router.push({
        name: "CustomerLogin"
      })
    },
    moveToRegister: function() {
      $('#loginDiag').modal('hide')
      this.$router.push({
        name: "CustomerRegister"
      })
    },
    openPurchaseDiag: function(ticketDetails) {
      if (ticketDetails.quantity_available > 0) {
        let info = {}
        if (this.$store.state.user.user.email) {
          info = {
            ticket: ticketDetails,
            eventId: ticketDetails.eventId,
            purchaser: this.$store.state.user.user.email,
          }

          this.intendedPurchase = info
          $('#purchaseTicketDiag').modal('show')
        } else {
          $('#loginDiag').modal('show')
          info = {}
        }
      } else {
        swal({
          title: "Sold Out :O",
          text: "Sorry that ticket is sold out",
          type: "warning"
        })
      }
    },

    submitPurchaseDiag: function(e) {
      this.loading = true
      let rawData = this.intendedPurchase
      rawData.qty = this.intendedQty
      let data = {
        purchaseInfo: rawData,
      }

      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/tickets/' + this.flyer._id + '/purchase', data).then((response) => {
        this.loading = false
        if (response.data.success) {
          this.store.dispatch('user/AddInvoice', response.data.data)
          $('#purchaseTicketDiag').modal('hide')
          swal({
            title: 'Purchase Succesful',
            text: 'Your tickets ready :)',
            type: 'success'
          })
        } else {
          $('#purchaseTicketDiag').modal('hide')
          swal({
            title: response.data.message,
            text: response.data.error.message,
            type: 'error'
          })
        }
      }).catch((e) => {
        this.loading = false
        swal({
          title: 'Network Error',
          text: e.message,
          type: 'error'
        })
      })
    },

    updateTickets: function(notificationData) {
      let tempArray = this.Tickets
      for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i]._id == notificationData._id) {
          tempArray.splice(i, 1, notificationData)
        }
      }
      this.Tickets = tempArray
    }
  },

  sockets: {
    customerNotifications(data) {
      switch (data.to) {
        case "all":
          switch (data.message) {
            case "Ticket Sale":
              this.$store.dispatch('events/SaleNotice', data.sale)
              break;
            default:

          }
          break;
        default:

      }
    },
    ticketUpdate(data) {
      switch (data.message) {
        case "Ticket Deleted":
          let current_tickets = this.flyer.tickets
          let current_position = current_tickets.findIndex((element) => {
            if (element._id == data.ticket._id) {
              return true
            } else {
              return false
            }
          })
          if (current_position != -1) {
            current_tickets.splice(current_position, 1)
            this.flyer.tickets = current_tickets
          }
          break;
          // case "Ticket Sold":
          //   let sold_position = this.tickets.findIndex((element) => {
          //     if (element._id == data.ticket._id) {
          //       return true
          //     } else {
          //       return false
          //     }
          //   })
          //
          //   if (sold_position != -1) {
          //     this.tickets[sold_position].quantity_available = this.tickets[sold_position].quantity_available - data.resolved_qty
          //   }
          //   break;
        default:

      }
    },
  }
}
</script>
