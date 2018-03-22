<template>
  <div class="container" id="content">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
              <div class="media">
                <img class="mr-3 rounded-circle" src="http://via.placeholder.com/100x100" alt="Generic placeholder image">
                <div class="media-body">
                  <h5 class="mt-0">{{ this.$store.state.user.username }}</h5>
                  <p>
                  </p>
                </div>
              </div>
          </div>

          <nav class="nav nav-tabs nav-fill">

            <router-link class="nav-item nav-link"  :to="{ name: 'CustomerTickets', params: {} }">My Tickets</router-link>
            <router-link class="nav-item nav-link" :to="{ name: 'CustomerEventList', params: {} }">My Events</router-link>


                <a href="#" class="nav-item nav-link">My Favorites <small><i>coming soon</i></small></a>


                <a href="#" class="nav-item nav-link">My Friends <small><i>coming soon</i></small></a>


          </nav>
          <div class="card-body">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import EventsPage from './EventsPage.vue'
export default {
  // components: {
  //   EventsPage
  // },
  sockets: {
    customerNotifications (data) {
      // console.log(data);
      if (data.to === this.$store.state.user.email) {
        /* eslint-disable no-console */
        console.log(data);
        switch (data.message) {
          case 'Ticket Created':
          this.$store.dispatch('UpdateCreatedTickets', data.redis.data)
          break;

          case 'Event Created':
          this.$store.dispatch('UpdateEvents', data.redis.data);
            break;
          default:
        }
        /* eslint-enable no-console */
      }
    }
  },
}
</script>

<style>
#content {
  margin-top: 50px;
}
</style>
