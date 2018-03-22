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
export default {
  components: {
    QrcodeReader
  },
  methods: {
    onDecode: function (content) {
      swal({
        title: 'Camera Found this',
        text: content,
        type: 'success'
      })
    }
  }
}
</script>
