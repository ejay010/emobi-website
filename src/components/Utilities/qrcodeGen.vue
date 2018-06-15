<template>
<img v-bind:src="qrcodeImg" class="mx-auto d-block"></img>
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
  data: function() {
    return {
      qrcodeImg: 'http://via.placeholder.com/350x150',
    }
  },
  mounted: function() {
    let awesomeqr = require('../../../public/awesome-qr/awesome-qr.js')
    let logo = new Image()
    logo.crossOrigin = "Anonymous"
    logo.onload = () => {
      awesomeqr().create({
        text: this.code,
        size: this.size,
        logoImage: logo,
        callback: (data) => {
          this.qrcodeImg = data
        }
      });
    }
    logo.src = "https://picsum.photos/200/?random"
  }
}
</script>
