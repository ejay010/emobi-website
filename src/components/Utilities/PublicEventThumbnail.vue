<template>
<div class="card">
  <img class="card-img-top" v-bind:src="flyerImageSrc" />
  <div class="card-body">
    <h4 class="card-title">{{flyer.title}}</h4>
    <p class="card-text" v-if="flyer.description">
      {{flyer.description}}
    </p>
  </div>
</div>
</template>

<style>

</style>

<script>
export default {
  props: [
    'flyer'
  ],
  computed: {
    flyerImageSrc(){
      if (this.flyer.flyer != null) {
        let flyerObj = JSON.parse(this.flyer.flyer)
        let imgsrc = process.env.VUE_APP_API_URL+flyerObj.filename+'-'+flyerObj.originalname
        return imgsrc;
      } else {
        return "http://via.placeholder.com/350x150"
      }
    }
  }
}
</script>
