<template>
<span>
  <router-link :to="{ name: 'CustomerEventList', params: {} }" class="btn btn-primary">Back to Event Menu</router-link>
<hr />
<div class="alert alert-warning" role="alert" v-if="!cameraOn">
  Please allow e-mobie to access your devices' camera.
</div>
  <div class="alert alert-warning" role="alert" v-if="found == false && cameraOn">
    Waiting for E-code...
  </div>
  <div class="alert alert-success" role="alert" v-if="found">
Found E-code!
</div>

    <div class="card">
    <div class="card-body">
      <span v-if="cameraLoading">
        <spinner></spinner>
      </span>
<div class="p-1">
  <qrcode-reader class="card-img" @init="onInit" @decode="onDecode" @locate="onLocate" :track="repaintLocation">
  </qrcode-reader>
</div>
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
      loading: false,
      qrCodeData: {},
    }
  },
  computed: {

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
      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/purchaseOrder/' + this.$route.params.eventId + '/' +
        this.qrCodeData.invoiceId + '/validate').then((response) => {
        console.log(response.data);
      })
    }
  }
}
</script>
