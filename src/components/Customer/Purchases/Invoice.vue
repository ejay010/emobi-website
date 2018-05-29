<template>
<div class="container">
  <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
  <button type="button" class="btn btn-success" data-toggle="modal" data-target="#eCode">View E-Code</button>
  <h5>{{ event_title }}</h5>
  <p>
    From: {{ start }} <br /> To: {{ finish }} <br /> Ticket: {{ event_title }}
  </p>
  <div class="card">
    <div class="card-header">
      Guest List <small>{{rsvp.length}} RSVP's, {{guests.length}} Guest spot(s)</small>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        {{ guests.length }} Guest Spot(s)
      </li>
      <li class="list-group-item" v-for="(spot, spot_index) in rsvp" :key="spot_index">
        {{spot.f_name}} {{spot.l_name}}
        <br /> {{spot.email}}
      </li>
    </ul>
  </div>

  <div class="modal" tabindex="-1" role="dialog" id="eCode">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">E-code</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <vqr :code="qrcode"></vqr>
          <!-- <div class="card">
            <div class="card-body">
            </div>
          </div> -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style>
</style>

<script>
import moment from 'moment'
import awesomeqr from '../../../assets/awesome-qr/awesome-qr.js'
import swal from 'sweetalert2'
import axios from 'axios'
import vqr from '../../Utilities/qrcodeGen.vue'
export default {
  components: {
    vqr
  },
  data() {
    return {
      invoice_data: {},
    }
  },

  mounted() {
    let url = process.env.VUE_APP_API_URL + '/invoice/' + this.$route.params.invoiceId
    axios.create({
      withCredentials: true
    }).get(url).then((response) => {
      this.invoice_data = response.data
    })
  },

  computed: {
    qrcode() {
      if (this.invoice_data != null) {
        return this.invoice_data._id
      }
    },
    start() {
      if (this.invoice_data.eventId != null) {
        return moment(this.invoice_data.eventId.startTime).format("dddd, MMMM Do, YYYY - hh:mm a")
      }
    },
    finish() {
      if (this.invoice_data.eventId != null) {
        return moment(this.invoice_data.eventId.finishTime).format("dddd, MMMM Do, YYYY - hh:mm a")
      }
    },
    rsvp() {
      if (this.invoice_data.rsvp_list != null) {
        return this.invoice_data.rsvp_list
      }
      return []
    },
    guests() {
      if (this.invoice_data.guest_passes != null) {
        return this.invoice_data.guest_passes
      }
      return []
    },
    event_title() {
      if (this.invoice_data.eventId != null) {
        return this.invoice_data.eventId.title
      }
      return " "
    }
  },

  methods: {
    confirmDelete() {
      swal({
        title: "Are you sure?",
        text: "Once it's gone...IT'S GONE FOREVER!!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch('user/deleteCustomerInvoice', this.invoice_data._id).then((response) => {
            if (response.success) {
              swal({
                title: 'Deleted!',
                text: 'Your Invoice has been deleted',
                type: 'success'
              }).then((result) => {
                if (result.value) {
                  this.$router.go(-1)
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
