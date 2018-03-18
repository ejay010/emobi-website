<template>
  <router-link :to="{ name: 'EventView', params: { email: this.flyer.publisher, eventkey: this.flyer._id } }">
    <div class="card">
      <img class="card-img-top" v-bind:src="flyerImageSrc" />
      <div class="card-body">
        <h4 class="card-title">{{flyer.title}}</h4>
        <h5>Start's on {{StartTime}}, End's on {{finishTime}}</h5>
        <p class="card-text" v-if="flyer.description">
          {{flyer.description}}
        </p>
      </div>
    </div>
  </router-link>

</template>

<style>

</style>

<script>
import moment from 'moment'
export default {
  props: [
    'flyer'
  ],
  computed: {
    flyerImageSrc(){
      if (this.flyer.flyer != null) {
        if (this.flyer.flyer != '') {
          let flyerImg = JSON.parse(this.flyer.flyer)
          let imgsrc = process.env.VUE_APP_API_URL+'/'+flyerImg.filename+'-'+flyerImg.originalname
          return imgsrc;
        } else {
          return "http://via.placeholder.com/350x150"
        }
      } else {
        return "http://via.placeholder.com/350x150"
      }
    },
    StartTime(){
      // return this.flyer.startTime
      return moment.utc(this.flyer.startTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    finishTime(){
      return moment.utc(this.flyer.finishTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
  },
}
</script>
