<template>
  <div class="card" :class="located">
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
      axios.create({
        withCredentials: true
      }).get(process.env.VUE_APP_API_URL+'/purchaseOrder/'+this.$route.params.eventId+'/'+content+'/redeem').then((response) => {
        if (response.data.success) {
          if (response.data.message == "Redemption Successful") {
            swal({
              title: response.data.message,
              text: response.data.data.qty_available+ ' of ' + response.data.data.resolved_qty+ ' available.',
              type: 'success'
            })
          }
        }
      })
    }
  }
}
</script>
