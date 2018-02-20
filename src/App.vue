<template>
  <span id="app">
    <NavigationBar></NavigationBar>
    <router-view></router-view>
  </span>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
// import Customer from './components/Customer.vue'

export default {

  name: 'app',
  components: {
    NavigationBar,
    // Customer,
  },
  created: function () {
    this.$store.dispatch('loadFlyers')
  },
  /* eslint-disable no-console */
  sockets: {
    customerNotifications(data){
      console.log(data);
      switch (data.to) {
        case this.$store.state.user.email:
          this.$store.dispatch('alertUser', data);
        break;
        case "all":
          switch (data.message) {
            case "Event Published":
            console.log(data);
              this.$store.dispatch('PublishPublicEvent', data.redis.data)
              break;
              case "Event Canceled":
              this.$store.dispatch('CancelPublicEvent', data.redis.data)
              break;
              case "Event Updated":
              console.log('Event Updated');
              this.$store.dispatch('UpdatePublicEvent', data.redis.data)
              console.log(data);
              break;
            default:

          }
          break;
        default:
        console.log(data);
      }
    }
  }
  /* eslint-enable no-console */
}
</script>

<style>
@import'~bootstrap/dist/css/bootstrap.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /* margin-top: 60px; */
}
#content {
  margin-top: 60px;
}

</style>
