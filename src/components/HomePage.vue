<template>
  <span>
    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="d-block w-100" src="http://via.placeholder.com/1350x600" alt="First slide">
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="http://via.placeholder.com/1350x600" alt="Second slide">
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="http://via.placeholder.com/1350x600" alt="Third slide">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
    <div class="container-fluid">
      <div class="card-columns p-3">
        <EventThumbnail v-for="flyer in PublicFlyers" v-bind:key="flyer._id" v-bind:flyer="flyer">
        </EventThumbnail>
      </div>
    </div>
  </span>
</template>

<style>
@import'~bootstrap/dist/css/bootstrap.css';

</style>

<script>
import EventThumbnail from './Utilities/PublicEventThumbnail.vue'
export default {
  components: {
    EventThumbnail
  },
  computed: {
    PublicFlyers(){
      // return []
      return this.$store.getters.PublicFlyers
    }
  }
}
</script>
