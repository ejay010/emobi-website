<template>
  <span class="list-group-item list-group-item-action flex-column align-items-start">
  <div class="pull-right">
    <router-link class="btn btn-secondary btn-sm" :to="{ name: 'EditEvent', params: {email: user.email, eventkey: customerEvent.rediskey} }">
      <icon name="edit"></icon>
      Edit
    </router-link>
    <button v-if="!published" class="btn btn-primary btn-sm" v-on:click="togglePublish">
      <icon name="bullhorn"></icon>
      Publish
    </button>
    <button v-else class="btn btn-danger btn-sm" v-on:click="togglePublish">
      <icon name="ban"></icon>
      Cancel
    </button>

  </div>
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">{{customerEvent.content.title}}</h5>
    <small class="text-muted">{{customerEvent.content.status}}</small>
  </div>
  <small class="text-muted">{{customerEvent.content.category}}</small>
  <p class="mb-1" v-if="customerEvent.content.description">
    {{ customerEvent.content.description }}
  </p>
  <p class="mb-1" v-else>Umm... you have yet to say what this awesome event is all about...soo N/A</p>
  </span>
</template>

<style>

</style>

<script>
import swal from 'sweetalert2'
  export default {
    props: [
      'customerEvent', 'user'
    ],
    computed: {
      published(){
        if (this.customerEvent.content.status == 'published') {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      /* eslint-disable no-console */
      togglePublish(){
        if (this.published) {
          this.$store.dispatch('cancelEvent', this.customerEvent.rediskey).then((response) => {
            if (!response.data.success) {
              swal({
                title: 'Something went wrong!',
                text: 'Please check your connection or contact System Admin',
                type: 'error'
              })
            } else {
              let currentEvent = response.data.updatedEvent
              console.log(currentEvent);
              if (currentEvent.rediskey === this.customerEvent.rediskey) {
                this.customerEvent.content.status = 'unpublished'
                swal({
                  title: 'Event Canceled',
                  text: ':( We hope it\'s just postponed',
                  type: 'warning',
                })
              }
            }
          })
        } else {
          this.$store.dispatch('publishEvent', this.customerEvent.rediskey).then((response) => {
            if (!response.data.success) {
              swal({
                title: 'Something went wrong!',
                text: 'Please check your connection or contact System Admin',
                type: 'error'
              })
            } else {
              let currentEvent = response.data.updatedEvent
              if (currentEvent.rediskey === this.customerEvent.rediskey) {
                this.customerEvent.content.status = 'published'
                swal({
                  title: 'Event Published',
                  text: 'Ok now it\'s share-able',
                  type: 'success',
                })
              }
            }

          })
        }
      }
      /* eslint-enable no-console */
    }
  }
</script>
