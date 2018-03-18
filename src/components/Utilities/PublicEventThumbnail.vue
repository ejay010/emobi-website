<template>
  <router-link :to="{ name: 'EventView', params: { email: this.flyer.publisher, eventkey: this.flyer._id } }" class="card-mod">
    <div class="card">
      <img class="card-img-top" v-bind:src="flyerImageSrc" />
      <div class="card-body">
        <h4 class="card-title">{{flyer.title}}</h4>
        <div class="card-text">
          <dl>
              <dt>Begins</dt>
              <dd>{{StartTime}}</dd>

              <dt>Ends</dt>
              <dd>{{finishTime}}</dd>

              <span v-if="flyer.description">
                <dt>Description</dt>
                <dd>
                  <p class="card-text" v-if="flyer.description">
                    {{flyer.description}}
                  </p>
                </dd>
              </span>
          </dl>
        </div>
      </div>
    </div>
  </router-link>

</template>

<style>
.card-mod{
  color: black;
  font-weight: normal;
  font-size: 100%;
  text-align: left;
}
a.card-mod:hover {
  color: #28a745;
  border-color: #28a745;
}
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
