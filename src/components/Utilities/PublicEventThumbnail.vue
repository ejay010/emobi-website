<template>
  <router-link :to="{ name: 'EventView', params: { email: this.flyer.content.publisher, eventkey: this.flyer.content.rediskey } }">
    <div class="card">
      <img class="card-img-top" v-bind:src="flyerImageSrc" />
      <div class="card-body">
        <h4 class="card-title">{{flyer.content.title}}</h4>
        <h5>Start's on {{StartTime}}, End's on {{finishTime}}</h5>
        <p class="card-text" v-if="flyer.content.description">
          {{flyer.content.description}}
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
      if (this.flyer.content.flyer != null) {
        let flyerImg = JSON.parse(this.flyer.content.flyer)
        let imgsrc = process.env.VUE_APP_API_URL+'/'+flyerImg.filename+'-'+flyerImg.originalname
        return imgsrc;
      } else {
        return "http://via.placeholder.com/350x150"
      }
    },
    StartTime(){
      // return this.flyer.content.startTime
      return moment.utc(this.flyer.content.startTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    finishTime(){
      return moment.utc(this.flyer.content.finishTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    eventLink(){
      // /publicEvents/ejay010@gmail.com/event:4
      return
    }
  },
}
</script>
