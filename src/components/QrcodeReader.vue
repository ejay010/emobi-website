<template>
<span>

    <div class="card" v-if="!haveGuests">
    <div class="card-header">
      Please Scan Ticket
    </div>
    <div class="card-body">
      <span v-if="cameraLoading">
        <spinner></spinner>
      </span>
<div class="p-1">
  <div class="alert alert-warning" role="alert" v-if="found == false">
    Waiting for E-code...
  </div>
  <div class="alert alert-success" role="alert" v-if="found">
    Found E-code!
  </div>
  <qrcode-reader class="card-img" @init="onInit" @decode="onDecode" @locate="onLocate" :track="repaintLocation">
  </qrcode-reader>
</div>
<div class="alert alert-warning" role="alert" v-if="!cameraOn">
  Please allow e-mobie to access your devices' camera.
</div>
<router-link :to="{ name: 'CustomerEventList', params: {} }" class="btn btn-primary">Back to Event Menu</router-link>
</div>
</div>

<div class="card" v-else>
  <div class="card-header">
    Validate and Verify Guest List
    <spinner v-if="this.loading"></spinner>
  </div>
  <div class="card-body">
    <p>
      Click on RSVP or Guest spot to confirm thier presence.
    </p>
    <div class="list-group">
      <button type="button" class="btn btn-default list-group-item" v-for="(guest, guest_index) in GuestList" :key="guest_index" @click="validateGuest(guest_index)">
        <span v-if="guest.guest_spot">
          Guest Spot
        </span>
        <span v-else>
          Name: {{guest.f_name}} {{guest.l_name}} <br />
          email: {{guest.email}} <br />
          Gender: {{guest.gender}}
        </span>
        <icon name="check" v-if="guest.outstanding != true"></icon>
      </button>
    </div>
  </div>
  <div class="card-footer">
    <button class="btn btn-success" @click="SubmitGuestList">Guest's Confirmed</button>
  </div>
</div>
</span>
</template>

<style>

</style>

<script>
import {
  QrcodeReader
} from 'vue-qrcode-reader'
import swal from 'sweetalert2'
import axios from 'axios'
import spinner from 'vue-spinner/src/ClipLoader.vue'
export default {
  components: {
    QrcodeReader,
    spinner
  },
  data: function() {
    return {
      cameraLoading: true,
      cameraOn: false,
      found: false,
      haveGuests: false,
      loading: false,
      InvoiceId: "",
      GuestList: [],
      qrCodeData: {}
    }
  },
  computed: {
    located: function() {
      if (this.found) {
        return {
          'text-white': true,
          'bg-success': true,
        }
      } else {
        return {
          'text-white': true,
          'bg-danger': true
        }
      }
    },
    guests: function() {
      let guestPasses = []
      if (this.GuestList.length > 0) {
        this.GuestList.forEach((element) => {
          if (element.guest_spot) {
            guestPasses.push(element)
          }
        })
      }
      return guestPasses;
    }
  },
  methods: {
    repaintLocation(location, ctx) {
      if (location !== null) {
        const {
          topLeftCorner,
          topRightCorner,
          bottomLeftCorner,
          bottomRightCorner,
        } = location

        ctx.strokeStyle = 'blue' // instead of red

        ctx.beginPath()
        ctx.moveTo(topLeftCorner.x, topLeftCorner.y)
        ctx.lineTo(bottomLeftCorner.x, bottomLeftCorner.y)
        ctx.lineTo(bottomRightCorner.x, bottomRightCorner.y)
        ctx.lineTo(topRightCorner.x, topRightCorner.y)
        ctx.lineTo(topLeftCorner.x, topLeftCorner.y)
        ctx.closePath()

        ctx.stroke()
      }
    },
    validateGuest(guest_index) {
      this.GuestList[guest_index].outstanding = false
    },
    SubmitGuestList() {
      this.loading = true
      let url = process.env.VUE_APP_API_URL + '/invoice/' + this.$route.params.eventId + '/' + this.InvoiceId + '/redeem'
      axios.create({
        withCredentials: true
      }).post(url, {
        GuestList: this.GuestList
      }).then((response) => {
        this.$store.dispatch('LogToSlack', {
          headline: 'From SubmitGuestList()',
          log: response.data
        })
        this.loading = false
        if (response.data.success) {
          swal({
            title: "Guests Confirmed",
            text: "Ok, they're on the list :)",
            type: 'success'
          })
        }
      }).catch((e) => {
        this.loading = false
        swal({
          title: "Communication Error",
          text: e.message,
          type: 'error'
        })
      })
    },
    async onInit(promise) {
      // show loading indicator
      this.cameraLoading = true
      try {
        await promise
        // this.cameraLoading = false
        // this.cameraOn = true

        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
          this.$store.dispatch('LogToSlack', {
            headline: 'NotAllowedError',
            log: error
          })
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
          this.$store.dispatch('LogToSlack', {
            headline: 'NotFoundError',
            log: error
          })
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
          this.$store.dispatch('LogToSlack', {
            headline: 'NotSupportedError',
            log: error
          })
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
          this.$store.dispatch('LogToSlack', {
            headline: 'NotReadableError',
            log: error
          })
        } else if (error.name === 'OverconstrainedError') {
          this.$store.dispatch('LogToSlack', {
            headline: 'OverconstrainedError',
            log: error
          })
          // passed constraints don't match any camera. Did you requested the front camera although there is none?
        } else {
          // browser is probably lacking features (WebRTC, Canvas)
          this.$store.dispatch('LogToSlack', {
            headline: 'From onInit() catchAll',
            log: error
          })
        }
      } finally {
        // hide loading indicator
        this.cameraLoading = false
        this.cameraOn = true
      }
    },
    onLocate: function(points) {
      if (points.length > 0) {
        this.found = true
      } else {
        this.found = false
      }
    },
    onDecode: function(content) {
      let queryString = content.slice(1).split('&')
      this.$store.dispatch('LogToSlack', {
        headline: 'testingStringInput',
        log: queryString
      })
      let queryObject = {}
      queryString.forEach(function(pair) {
        pair = pair.split('=');
        queryObject[pair[0]] = decodeURIComponent(pair[1] || '');
      })
      let result = JSON.parse(JSON.stringify(queryObject))
      this.$store.dispatch('LogToSlack', {
        headline: 'QueryString',
        log: result
      })
      this.qrCodeData = result
      if (result.list != null) {
        axios.create({
          withCredentials: true
        }).get(process.env.VUE_APP_API_URL + '/purchaseOrder/' + this.$route.params.eventId + '/' + result.id + '/validate').then((response) => {
          this.$store.dispatch('LogToSlack', {
            headline: 'Server Response',
            log: response.data
          })
          if (response.data.success) {
            switch (response.data.message) {
              case "Tickets Exhausted":
                swal({
                  title: response.data.message,
                  text: 'This ticket is exhausted :(',
                  type: 'warning'
                })
                break;

              case "Ticket Found":
                swal({
                  title: response.data.message,
                  text: "Ticket Found, Please Confirm Guests",
                  type: 'success'
                })
                this.InvoiceId = response.data.invoice._id
                this.GuestList = response.data.invoice.contents
                this.haveGuests = true
                break;
              default:
                this.$store.dispatch('LogToSlack', {
                  headline: 'Scanning Error',
                  log: response.data
                })
            }
          } else {
            if (response.data.message == "Redemption Error") {
              swal({
                title: response.data.message,
                text: response.data.error.message,
                type: 'error'
              })
            }

            this.$store.dispatch('LogToSlack', {
              headline: 'Communication Error',
              log: response.data
            })
          }
        }).catch((e) => {
          swal({
            title: "Server Communication Error",
            message: e.message,
            type: 'error'
          })
          this.$store.dispatch('LogToSlack', {
            headline: 'Communication Error',
            log: e
          })
        })
      }
    }
  }
}
</script>
