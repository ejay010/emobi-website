<template>
  <div class="card" :class="located">
    <div class="alert alert-warning" role="alert">
        Please allow e-mobie to access your devices' camera.
    </div>
    <span class="p-3">
      <qrcode-reader class="card-img" @decode="onDecode" @locate="onLocate"></qrcode-reader>
    </span>
  </div>
</template>

<style>

</style>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'
import swal from 'sweetalert2'
import axios from 'axios'
export default {
  components: {
    QrcodeReader
  },
  data: function () {
    return {
      found: false
    }
  },
  computed: {
    located: function () {
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
    onLocate: function (points) {
      if (points.length > 0) {
        this.found = true
      } else {
        this.found = false
      }
    },
    onDecode: function (content) {
      console.log('here is the image content');
      console.log(content);
      axios.create({
        withCredentials: true
      }).get(process.env.VUE_APP_API_URL+'/purchaseOrder/'+this.$route.params.eventId+'/'+content+'/redeem').then((response) => {
        console.log('post response');
        if (response.data.success) {
          switch (response.data.message) {
            case "Tickets Exhausted":
            swal({
              title: response.data.message,
              text: 'This ticket is exhausted :('
              type: 'warning'
            })
            break;
            case "Redemption Successful":
            swal({
              title: response.data.message,
              text: response.data.data.qty_available+ ' of ' + response.data.data.resolved_qty+ ' available.',
              type: 'success'
            })
              break;
            default:
            console.log(response);
          }
        }
      })
    }
  }
}
</script>
