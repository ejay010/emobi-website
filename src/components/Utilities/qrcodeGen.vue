<template>
  <div class="container">
    <img v-bind:src="qrcodeImg" class="img-fluid"></img>
  </div>
</template>

<style>

</style>

<script>
export default {
  props: {
    code: {
      type: String,
      default: 'blank'
    },
    size: {
      type: Number,
      default: 350
    }
  },
  data: function () {
    return {
      qrcodeImg: 'http://via.placeholder.com/350x150',
    }
  },
  mounted: function () {
    let awesomeqr = require('../../../public/awesome-qr/awesome-qr.js')
    awesomeqr().create({
      text: this.code,
      size: this.size,
      margin: 20,
      callback: (data) => {
        this.qrcodeImg = data
      }
    });
  }
}
</script>
