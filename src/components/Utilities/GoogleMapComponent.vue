<template>
<span>
    <gmap-autocomplete class="form-control" @place_changed="updateLocation" :required="!hasMarker" v-if="showAutoComplete"></gmap-autocomplete>
    <gmap-map
      :center="center"
      :zoom="zoom"
      map-type-id="roadmap"
      :style="mapStyle"
      :class="mapClass"
    >
    <gmap-marker :position="MapGeoMarker.geometry.location" v-if="hasMarker">
    </gmap-marker>
    </gmap-map>
  </span>
</template>

<style>

</style>

<script>
export default {
  mounted: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    } else {
      this.errors.push({
        node: 'Location',
        message: "Location data not available"
      })
    }
  },
  data: function() {
    return {
      currentLocation: {},
      userlocation: {},
      raw_location_data: {}
    }
  },
  props: {
    MapMarker: {
      type: Object,
    },
    mapStyle: {
      default: function() {
        return {
          width: '500px',
          height: '300px'
        }
      }
    },
    mapClass: {
      default: function() {
        return {
          'img-responsive': true
        }
      }
    },
    showAutoComplete: {
      default: true
    },
    zoom: {
      type: Number,
      default: 8
    }
  },
  computed: {
    hasMarker: function() {
      if (this.MapMarker != null) {
        return true
      } else {
        return false
      }
    },
    MapGeoMarker: function() {
      if (this.hasMarker) {
        return this.MapMarker
      } else {
        return {
          geometry: {
            location: {
              lat: 25.06,
              lng: -77.345
            }
          }
        }
      }
    },
    center: function() {
      return this.MapGeoMarker.geometry.location
      // if (!this.hasMarker) {
      //   if (this.currentLocation.lat != null) {
      //     return this.currentLocation
      //   } else {
      //     return {
      //       lat: 25.06,
      //       lng: -77.345
      //     }
      //   }
      // } else {
      //   if (this.MapGeoMarker != null) {
      //     return this.MapGeoMarker.geometry.location
      //   } else {
      //     return {
      //       lat: 25.06,
      //       lng: -77.345
      //     }
      //   }
      // }
    },
  },
  methods: {
    updateLocation: function(data) {
      this.$emit('location_Changed', data)
      this.userlocation = data
    }
  }
}
</script>
