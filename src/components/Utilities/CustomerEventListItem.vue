<template>
  <span class="list-group-item list-group-item-action flex-column align-items-start">
  <div class="pull-right">
    <router-link class="btn btn-secondary btn-sm" :to="{ name: 'EditEvent', params: {email: user.email, eventkey: customerEvent._id} }">
      <icon name="edit"></icon>
      Edit
    </router-link>
    <button v-if="!published" class="btn btn-primary btn-sm" v-on:click="PublishEvent">
      <icon name="bullhorn"></icon>
      Publish
    </button>
    <button v-else class="btn btn-danger btn-sm" v-on:click="CancelEvent">
      <icon name="ban"></icon>
      Cancel
    </button>
    <button class="btn btn-primary btn-sm" v-on:click="ManageTickets">
        <icon name="ticket"></icon>
        Manage Tickets
    </button>

    <router-link class="btn btn-success btn-sm" :to="{ name: 'QrReader', params: {eventId: customerEvent._id} }">
      <icon name="qrcode" style="vertical-align:middle;"></icon>
    Redeem Ticket/Voucher</router-link>

    <button class="btn btn-danger btn-sm" @click="DeleteEvent">
      Delete
    </button>
  </div>
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">{{customerEvent.title}}</h5>
    <small class="text-muted">{{customerEvent.status}}</small>
  </div>
  <small class="text-muted">{{customerEvent.category}}</small>
  <p class="mb-1" v-if="customerEvent.description">
    {{ customerEvent.description }}
  </p>
  <p class="mb-1" v-else>Umm... you have yet to say what this awesome event is all about...soo N/A</p>
  </span>
</template>

<style>

</style>

<script>
import swal from 'sweetalert2'
  export default {
    props: [
      'customerEvent', 'user'
    ],
    computed: {
      published(){
        if (this.customerEvent != null) {
          if (this.customerEvent.status == 'published') {
            return true
          } else {
            return false
          }
        }
      }
    },
    methods: {
      DeleteEvent: function () {
        this.$store.dispatch('DeleteEvent', this.customerEvent)
      },
      ManageTickets(){
        this.$router.push({name: 'ManageTickets', params: { eventId: this.customerEvent._id }})
      },
      /* eslint-disable no-console */
      PublishEvent(){
        this.$store.dispatch('publishEvent', this.customerEvent._id).then((response) => {
          if (!response.data.success) {
            swal({
              title: 'Something went wrong!',
              text: 'Please check your connection or contact System Admin',
              type: 'error'
            })
          } else {
            let currentEvent = response.data.updatedEvent
            if (currentEvent._id === this.customerEvent._id) {
              this.customerEvent.status = 'published'
              swal({
                title: 'Event Published',
                text: 'Ok now it\'s share-able',
                type: 'success',
              })
            }
          }

        })
      },

      CancelEvent(){
        this.$store.dispatch('cancelEvent', this.customerEvent._id).then((response) => {
          if (!response.data.success) {
            swal({
              title: 'Something went wrong!',
              text: 'Please check your connection or contact System Admin',
              type: 'error'
            })
          } else {
            let currentEvent = response.data.updatedEvent
            if (currentEvent._id === this.customerEvent._id) {
              this.customerEvent.status = 'unpublished'
              swal({
                title: 'Event Canceled',
                text: ':( We hope it\'s just postponed',
                type: 'warning',
              })
            }
          }
        })
      },
      /* eslint-enable no-console */
    }
  }
</script>
