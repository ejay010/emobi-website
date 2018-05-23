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
  <qrcode-reader class="card-img" @init="onInit" @decode="onDecode" @locate="onLocate">
    On stream
  </qrcode-reader>
</div>
<div class="alert alert-warning" role="alert" v-if="!cameraOn">
  Please allow e-mobie to access your devices' camera.
</div>
<router-link :to="{ name: 'CustomerEventList', params: {} }" class="btn btn-primary">Back to Event Menu</router-link>
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
      haveGuests: false
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
    }
  },
  methods: {
    async onInit(promise) {
      // show loading indicator

      try {
        await promise
        this.cameraLoading = false
        this.cameraOn = true
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
        } else if (error.name === 'OverconstrainedError') {
          // passed constraints don't match any camera. Did you requested the front camera although there is none?
        } else {
          // browser is probably lacking features (WebRTC, Canvas)
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
      axios.create({
        withCredentials: true
      }).get(process.env.VUE_APP_API_URL + '/purchaseOrder/' + this.$route.params.eventId + '/' + content + '/validate').then((response) => {
        console.log('post response');
        console.log(response.data);
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
                text: "Ticket Found, Please Verify Guests",
                type: 'success'
              })
              break;
            default:
              console.log(response);
          }
        } else {
          if (response.data.message == "Redemption Error") {
            swal({
              title: response.data.message,
              text: response.data.error.message,
              type: 'error'
            })
          }
          // console.log('communication error');
          console.log(response);
        }
      }).catch((e) => {
        swal({
          title: "Sever communication Error",
          text: e.message,
          type: 'error'
        })
      })
    }
  }
}
</script>
