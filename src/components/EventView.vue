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
                  <googleMap :showAutoComplete="false" :mapStyle="mapStyle" :MapMarker="locationData.geometry" :zoom="10"></googleMap>
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
  <div class="modal" tabindex="-1" role="dialog" id="purchaseTicketDiag">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">Purchase {{intendedPurchase.ticket.title}}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
              </div>
              <form v-on:submit.prevent="submitPurchaseDiag">
                <div class="modal-body">
                  <div class="form-group">
                      <label for="qty">How much tickets?</label>
                      <input type="number" min="1" step="1" class="form-control" name="qty" id="qty" v-model="intendedQty" />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary" :disabled="loading">Make Purchase
                    <loader class="button-loader" :loading="loading" :color="loaderColor" :size="loaderSize"></loader>
                  </button>
        <button type="reset" class="btn btn-secondary" data-dismiss="modal" :disabled="loading">Close</button>
                </div>
              </form>
          </div>
      </div>
  </div>

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
import $ from 'jquery'
export default {
  components: {
    Loader,
    googleMap
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
      flyer: {},
      intendedQty: 1,
      intendedPurchase: {
        ticket: {},
        eventId: "",
        purchaser: "",
      }
    }
  },
  created: function() {
    this.$store.dispatch('findPublicEvent', this.$route.params).then((response) => {
      this.flyer = response.data;
    })

  },
  computed: {
    flyerImg(){
      if (this.flyer.flyer) {
        this.flyer.flyer = JSON.parse(this.flyer.flyer)
        this.flyer.flyer.src = process.env.VUE_APP_API_URL+'/'+this.flyer.flyer.filename+'-'+this.flyer.flyer.originalname

        axios.get(process.env.VUE_APP_API_URL+'/tickets/'+this.flyer._id+'/fetch').then((response) => {
          this.Tickets = response.data.AvailableTickets
        })

        return this.flyer.flyer.src
      }
      return null
    },
    StartTime(){
      // return this.flyer.content.startTime
      return moment.utc(this.flyer.startTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    finishTime(){
      return moment.utc(this.flyer.finishTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    locationData(){
      if (this.flyer.location != null) {
        return JSON.parse(this.flyer.location)
      } else {
        return {}
      }
    },
    tickets(){
      if (this.flyer.tickets != null) {
        if (this.flyer.tickets.length > 0) {
          return this.flyer.tickets
        } else {
          return []
        }
      } else {
        return []
      }
    }
  },
  methods: {
    moveToSignIn: function () {
      $('#loginDiag').modal('hide')
      this.$router.push({name: "CustomerLogin"})
    },
    moveToRegister: function () {
      $('#loginDiag').modal('hide')
      this.$router.push({name: "CustomerRegister"})
    },
    openPurchaseDiag: function (ticketDetails){
      let info = {}
      if (this.$store.state.user.email) {
        info = {
          ticket: ticketDetails,
          eventId: ticketDetails.eventId,
          purchaser: this.$store.state.user.email,
        }

        this.intendedPurchase = info
        $('#purchaseTicketDiag').modal('show')
      } else {
        $('#loginDiag').modal('show')
        info = {}
      }
    },

    submitPurchaseDiag: function (e) {
      this.loading = true
      let rawData = this.intendedPurchase
      rawData.qty = this.intendedQty
      let data = {
        purchaseInfo: rawData,
      }

      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL+'/tickets/'+this.flyer._id+'/purchase', data).then((response) => {
        this.loading = false
        // console.log(response);
        if (response.data.success) {
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

    updateTickets: function (notificationData) {
      let tempArray = this.Tickets
      for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i]._id == notificationData._id) {
          console.log("inside it");
          tempArray.splice(i, 1, notificationData)
        }
      }
      this.Tickets = tempArray
    }
  },

  sockets: {
    customerNotifications(data){
      switch (data.to) {
        case "all":
        // console.log(data);
          switch (data.message) {
            case "Ticket Sold":
              this.updateTickets(data.redis.data.TicketInfo)
              break;
            default:
          }
          break;

          case this.$store.state.user.email:
          switch (data.message) {
            case "Ticket Bought":
            console.log(data);
              this.$store.dispatch('UpdatePurchasedTickets', data.redis.data.PurchaseOrder)
              break;
            default:

          }
          break;
        default:
      }
    }
  }
}
</script>
