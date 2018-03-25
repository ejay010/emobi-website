<template>
  <div class="card">
      <qrcode-reader class="card-img" @decode="onDecode"></qrcode-reader>
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
  methods: {
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
