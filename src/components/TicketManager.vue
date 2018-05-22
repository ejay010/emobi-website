<template>
<span>
    <div class="container" v-if="tickets.length == 0">
              <div class="jumbotron">
                <h2>Tickets for {{event.title}}</h2>
                  <h3>There are '0' Tickets... </h3>
                  <button class="btn btn-primary" data-toggle="modal" data-target="#createTicketForm"><icon name="plus"></icon> Create ticket</button>
              </div>
    </div>
    <div class="container" v-else>
      <div class="row">
          <div class="col-lg-12">
                '{{tickets.length}}' tickets for {{event.title}}
            <span class="float-right">
              <router-link :to="{ name: 'EditEvent', params: { email: this.$store.state.user.user.email, eventkey: event._id} }" class="btn btn-default btn-sm">Back to Event</router-link>
              <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#createTicketForm">
                <!-- <icon name="plus" style="vertical-align:middle;"></icon> -->
                Create a New Ticket
              </button>
            </span>
</div>
</div>
<hr/>
<div class="list-group">
  <CreatedTicket v-for="ticket in tickets" :key="ticket._id" :ticket="ticket"></CreatedTicket>
</div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="createTicketForm">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">So this ticket is....</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
      </div>
      <div class="modal-body">
        <p class="lead">
          Please provide basic information about the ticket
        </p>
        <form enctype="multipart/form-data" v-on:submit.prevent="CreateTicket">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" name="title" id="title" v-model="newTicket.title" />
          </div>
          <div class="form-group">
            <label for="quantity_available">Quantity</label>
            <input type="number" step="1" min="5" name="quantity_available" id="quantity_available" class="form-control" v-model="newTicket.quantity_available" />
          </div>
          <div class="form-check form-check-inline">
            <p>
              Is this a Paid (customers have to pay for it) or Free (Free to get, required for entry) ticket
            </p>
            <div class="custom-control custom-radio custom-control-inline">
              <input type="radio" id="customRadioInline1" name="paid_or_free" v-model="newTicket.paid_or_free" value="Paid" class="custom-control-input" disabled="true">
              <label class="custom-control-label" for="customRadioInline1">Paid (Coming Soon)</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input type="radio" id="customRadioInline2" name="paid_or_free" checked="true" v-model="newTicket.paid_or_free" value="Free" class="custom-control-input">
              <label class="custom-control-label" for="customRadioInline2">Free</label>
            </div>
          </div>
          <div class="form-group">
            <label for="ticket_image">Ticket Image</label>
            <input type="file" class="form-control" accept="image/*" name="ticket_image" id="ticket_image" v-on:change="fileSelected" />
          </div>
          <div class="form-group">
            <label for="ticket_description">A short Description</label>
            <textarea name="ticket_description" id="ticket_description" class="form-control" v-model="newTicket.description"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Create Ticket</button>
        </form>
      </div>
    </div>
  </div>
</div>
</span>
</template>

<style>

</style>

<script>
import axios from 'axios'
import CreatedTicket from './Customer/Events/CreatedTicketListItem.vue'
import swal from 'sweetalert2'
import $ from 'jquery'
export default {
  components: {
    CreatedTicket
  },
  props: [
    'eventId'
  ],
  data() {
    return {
      newTicket: {
        title: "",
        quantity_available: 5,
        description: '',
        paid_or_free: "Free"
      },
      new_ticket_image: {}
    }
  },

  computed: {
    event: function() {
      return this.$store.state.user.Events.find(
        (element) => {
          if (element._id == this.eventId) {
            return true
          }
        }
      )
    },
    tickets: function() {
      if (this.event != null) {
        return this.event.tickets
      }
    }
  },
  methods: {
    fileSelected(evt) {
      let image = evt.target.files || evt.dataTransfer.files
      this.new_ticket_image = image
    },
    CreateTicket() {
      const formData = new FormData();
      if (this.$data.new_ticket_image[0] != null) {
        formData.append('ticket_image', this.$data.new_ticket_image[0], this.$data.new_ticket_image[0].name);
      }
      let data = this.$data.newTicket;

      formData.append('seedData', JSON.stringify(data))

      let post_url = process.env.VUE_APP_API_URL + '/tickets/' + this.event.publisher + '/' + this.eventId + '/create'
      axios({
        url: post_url,
        method: 'POST',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'mutlipart/form-data'
        }
      }).then((response) => {
        if (response.data.success) {
          $('#createTicketForm').modal('hide')
          swal({
            title: 'Ticket Created',
            type: 'success',
          })
        } else {
          $('#createTicketForm').modal('hide')
          swal({
            title: 'Something Went Wrong',
            type: 'error',
            text: response.data.message
          })
        }
      })
    }
  }
}
</script>
