<template>
  <span>

  <div class="container">
    <div class="card">
      <img class="card-img-top" v-bind:src="flyerImg"/>
      <div class="card-body">
        <h5 class="card-title">{{flyer.title}}</h5>
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
            <dt>
                Tickets
            </dt>
            <dd>
                <div v-if="Tickets.length == 0">
                    <p>None Avaiable</p>
                </div>
                <div v-else>
                    <div class="list-group">
                        <div class="list-group-item" v-for="ticket in Tickets" :key="ticket._id">
                          <div class="media">
                              <div class="media-body">
                                <h5 class="mt-0">{{ticket.title}} | <small>{{ticket.paid_or_free}}</small></h5>
                                <button class="btn btn-default" v-on:click="openPurchaseDiag(ticket)">Purchase</button>
                              </div>
                          </div>
                            <p>Qty Avail: {{ticket.quantity_available}}</p>
                            <p>{{ticket.description}}</p>
                        </div>
                    </div>
                </div>
            </dd>
          </dl>
        </p>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" role="dialog" id="purchaseTicketDiag">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">Purchase Tickets</h5>
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
                  <button type="submit" class="btn btn-primary">Make Purchase</button>
        <button type="reset" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </form>
          </div>
      </div>
  </div>
  </span>
</template>

<style>

</style>

<script>
import moment from 'moment'
import axios from 'axios'
import $ from 'jquery'
export default {
  data() {
    return {
      flyer: {},
      Tickets: [],
      intendedQty: 1,
      intendedPurchase: {}
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
  },
  methods: {
    openPurchaseDiag: function (ticketDetails){
      let info = {}
      if (this.$store.state.user.email) {
        info = {
          ticket: ticketDetails._id,
          eventId: ticketDetails.eventId,
          purchaser: this.$store.state.user.email,
        }

        this.intendedPurchase = info
        $('#purchaseTicketDiag').modal('show')
      } else {
        alert("Please log in")
        info = {}
      }
    },

    submitPurchaseDiag: function (e) {
      let rawData = this.intendedPurchase
      rawData.qty = this.intendedQty
      let data = {
        purchaseInfo: rawData,
      }
      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL+'/tickets/'+this.flyer._id+'/purchase', data).then((response) => {
        console.log(response);
      })
    }
  }
}
</script>
