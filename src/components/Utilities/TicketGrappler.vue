<template>
<div class="modal" tabindex="-1" role="dialog" id="purchaseTicketDiag">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Purchase {{total_passes}} ticket(s)</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form v-on:submit.prevent="submitPurchaseDiag">
        <div class="modal-body" style="min-height: 450px; max-height: 600px; overflow-y: scroll" id="ticketRell">
          <p>{{rsvp_passes}} RSVP Spot(s), {{guest_passes}} Guest Spot(s)</p>
          <div class="list-group" id="ticketList">
            <div class="form-group list-group-item" v-for="(slot, slot_key) in ticket_list" :key="slot_key">
              <div class="d-flex w-100 justify-content-between">
                <h5>Ticket #{{slot_key + 1}}</h5>
                <button type="button" class="btn btn-danger" @click="remove(slot_key)">
                      Remove
                    </button>
              </div>
              <span v-if="!slot.guest_spot">
                    <label :for="slot_key + '_fname'">First Name</label>
                    <input type="text" class="form-control" :name="slot_key + '_fname'" :id="slot_key + '_fname'" v-model="slot.f_name" required/>
                    <label :for="slot_key + '_lname'">Last Name</label>
                    <input type="text" class="form-control" :name="slot_key + '_lname'" :id="slot_key + '_lname'" v-model="slot.l_name" required/>
                    <label :for="slot_key + '_email'">Email</label>
                    <input class="form-control" type="email" :name="slot_key + '_email'" :id="slot_key + '_email'" v-model="slot.email" required/>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" :id="slot_key + '_gender-M'" :name="slot_key + '_gender'" value="M" v-model="slot.gender">
                      <label class="form-check-label" :for="slot_key + '_gender-M'">Male</label>
                      <input class="form-check-input" type="radio" :id="slot_key + '_gender-F'" :name="slot_key + '_gender'" value="F" v-model="slot.gender">
                      <label class="form-check-label" :for="slot_key + '_gender-F'">Female</label>
                    </div>
                  </span>
              <span v-else>
                    <p>Guest Spot</p>
                  </span>
            </div>
          </div>
        </div>
        <div class="modal-footer text-center">
          <button type="button" class="btn btn-default" @click="addRsvpSlot">Add RSVP</button>
          <button type="button" class="btn btn-default" @click="addGuestSlot">Add Guest Pass</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">Submit
                    <loader class="button-loader" :loading="loading" :color="loaderColor" :size="loaderSize"></loader>
                  </button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import Loader from 'vue-spinner/src/ClipLoader.vue'
import $ from 'jquery'
import axios from 'axios'
import swal from 'sweetalert2'
export default {
  components: {
    Loader
  },
  props: ['purchase'],
  data() {
    return {
      loading: false,
      loaderColor: '#fff',
      loaderSize: '6px',
      ticket_list: [{
        f_name: "",
        l_name: "",
        email: "",
        gender: "M",
        guest_spot: false
      }],
    };
  },
  methods: {
    remove(slot_key) {
      this.ticket_list.splice(slot_key, 1)
    },
    addRsvpSlot() {
      this.ticket_list.push({
        f_name: "",
        l_name: "",
        gender: "F",
        guest_spot: false
      })
      let height = $('#ticketList').height();
      $('#ticketRell').animate({
        scrollTop: height
      }, 500);
    },
    addGuestSlot() {
      this.ticket_list.push({
        guest_spot: true,
      })
      let height = $('#ticketList').height();
      $('#ticketRell').animate({
        scrollTop: height
      }, 500);
    },
    submitPurchaseDiag() {
      let purchaseInfo = {
        eventId: this.purchase.eventId,
        purchaser: this.purchase.purchaser,
        ticketId: this.purchase.ticket._id,
        stubs: this.ticket_list
      }

      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/tickets/' + this.purchase.eventId + '/purchase', purchaseInfo).then((response) => {
        // console.log(response.data);
        $('#purchaseTicketDiag').modal('hide')
        if (response.data.success) {
          this.$store.dispatch('user/AddInvoice', response.data.data)
          swal({
            title: 'Purchase Complete',
            text: 'Your tickets are in your hub',
            type: 'success'
          })
        } else {
          swal({
            title: response.data.message,
            text: response.data.message,
            type: 'error'
          })
        }
      })
    }
  },
  computed: {
    total_passes() {
      return this.ticket_list.length
    },

    guest_passes() {
      let guests = this.ticket_list.filter(obj => obj.guest_spot != false)
      return guests.length
    },

    rsvp_passes() {
      let rsvps = this.ticket_list.filter(obj => obj.guest_spot != true)
      return rsvps.length
    }
  }
}
</script>

<style>
</style>
