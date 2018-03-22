<template>
    <div id="qrholder"></div>
</template>

<style>

</style>

<script>
  import awesomeqr from 'awesome-qr'
  export default {
    props: [
      'ticket'
    ],
    data: function () {

    },
    computed: {
      qrcode: function () {
        if (this.ticket != null) {
          awesomeqr.create({
            text: 'Makito loves Kafuu Chino.',
            size: 800,
            margin: 20,
            bindElement: 'qrholder'
          })
        } else {
          return false
        }
      }
    }
  }
</script>
