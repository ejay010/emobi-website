<template>
<div class="container">
  <div class="card">
    <img class="card-img-top" v-bind:src="flyerImg"/>
    <div class="card-body">
      <h5 class="card-title">{{flyer.title}}</h5>
      <p class="card-text">
        <dl>
          <dt>
            Start
          </dt>
          <dd>
            {{StartTime}}
          </dd>
          <dt>
            Finish
          </dt>
          <dd>
            {{finishTime}}
          </dd>
          <dt>
            Description
          </dt>
          <dd>
            {{flyer.description}}
          </dd>
        </dl>
      </p>
    </div>
  </div>
</div>
</template>

<style>

</style>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      flyer: {}
    }
  },
  created: function() {
    // console.log(this.$route.params);
    this.$store.dispatch('findPublicEvent', this.$route.params).then((response) => {
      this.flyer = response.data;
    })

  },
  computed: {
    flyerImg(){
      if (this.flyer.flyer) {
        this.flyer.flyer = JSON.parse(this.flyer.flyer)
        this.flyer.flyer.src = process.env.VUE_APP_API_URL+'/'+this.flyer.flyer.filename+'-'+this.flyer.flyer.originalname

        return this.flyer.flyer.src
      }
      return this.flyer
    },
    StartTime(){
      // return this.flyer.content.startTime
      return moment.utc(this.flyer.startTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    finishTime(){
      return moment.utc(this.flyer.finishTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
  }
}
</script>
