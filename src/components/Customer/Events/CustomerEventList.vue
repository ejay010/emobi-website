<template>
<span>
  <div class="container">
    <div class="row" v-if="eventCounter < 1">
      <div class="col-lg-12">
        <div class="jumbotron">
          <h1 class="display-4">Having somthing big? :)</h1>
          <p class="lead">
            Create an event and share it with the world, or keep it close to home and invite, <u>only</u>, your bestest buds!
            <button class="btn btn-success btn-lg" data-toggle="modal" data-target="#createEventForm">Create an Event</button>
          </p>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-lg-12">
        Your Events: {{eventCounter}}
        <span class="float-right">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#createEventForm">
            <icon name="plus" style="vertical-align:middle;"></icon>
            Create a new Event
          </button>
        </span>
<hr />
<div class="list-group">
  <CustomerEventListItem v-for="item in userEvents" :key="item._id" :customer-event="item" :user="user"></CustomerEventListItem>
</div>
</div>
</div>
</div>
<div class="modal" tabindex="-1" role="dialog" id="createEventForm">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Before we get started...</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
      <div class="modal-body">
        <p class="lead">
          We just need some general information about your event before its creation. After that we can add the specifics. And finaly when everything is perfect you can publish it.
        </p>
        <form v-on:submit.prevent="seedEvent">

          <div class="form-group">
            <label for="eventPurpose">What is the purpose of your event</label>
            <select class="custom-select" name="eventPurpose" id="eventPurpose" v-model="eventPurpose" required>
                <option value="entertainment">
                  Entertainment
                </option>
                <option value="professional-networking">
                  Professional Networking
                </option>
                <option value="spiritual">
                  Spirituality
                </option>
                <option value="exercise-fitness">
                  Exercise & fitness
                </option>
                <option value="fundraiser">
                  Fundraiser
                </option>
                <option value="social">
                  Casual Social / Mixer
                </option>
              </select>
          </div>

          <div class="form-check form-check-inline">
            <p>
              Is this a public (the world can see it) or private (just invited friends) event
            </p>
            <div class="custom-control custom-radio custom-control-inline">
              <input type="radio" id="customRadioInline1" name="customRadioInline1" value="public" v-model="eventType" class="custom-control-input" selected>
              <label class="custom-control-label" for="customRadioInline1">Public</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input type="radio" id="customRadioInline2" name="customRadioInline1" value="private" v-model="eventType" class="custom-control-input">
              <label class="custom-control-label" for="customRadioInline2">Private</label>
            </div>
          </div>
          <div class="form-group">
            <label for="eventName">Give it a name...</label>
            <input type="text" class="form-control" name="eventName" id="eventName" v-model="eventName" required/>
          </div>

          <button class="btn btn-success" type="submit" :disabled="loading">Awesome-sauce, let's get started :)
              <loader class="button-loader" :loading="loading" :color="loaderColor" :size="loaderSize"></loader>
            </button>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-dismiss="modal">Not ready yet..</button>
      </div>
    </div>
  </div>
</div>
</span>
</template>

<style>
.button-loader {
  display: inline;
}
</style>

<script>
import Loader from 'vue-spinner/src/PulseLoader.vue'
import CustomerEventListItem from './CustomerEventListItem.vue'
import swal from 'sweetalert2'
import $ from 'jquery'
export default {
  components: {
    CustomerEventListItem,
    Loader
  },
  data() {
    return {
      loading: false,
      loaderColor: '#fff',
      loaderSize: '6px',
      user: this.$store.state.user.user,
      eventPurpose: null,
      eventName: null,
      eventType: "public",
      errors: []
    };
  },
  mounted: function() {
    this.$store.dispatch('user/initCustomerEvents')
  },
  computed: {
    userEvents() {
      return this.$store.state.user.Events;
    },
    eventCounter() {
      return this.userEvents.length
    }
  },
  methods: {
    validateForm() {

    },
    seedEvent() {
      this.loading = true
      let data = {
        // user: this.user,
        eventPurpose: this.eventPurpose,
        eventName: this.eventName,
        eventType: this.eventType
      }
      this.$store.dispatch('events/Create', data).then(
        response => {
          this.loading = false
          /* eslint-disable no-console */
          if (response.data.success) {
            this.$store.dispatch('user/UpdateEvents', response.data.response)
            $('#createEventForm').modal('hide')
            swal({
              title: 'Event Created',
              text: 'Ok now it\'s time for more details, add more info under the edit screen',
              timer: 4500,
              type: 'success',
              showConfirmButton: false
            }).then((result) => {
              if (result) {
                this.$data.eventName = "",
                  this.$data.eventType = "",
                  this.$data.eventPurpose = null
              }
            })
          }
          /* eslint-enable no-console */
        }
      ).catch((e) => {
        this.loading = false
        swal({
          title: "Something Went Wrong",
          text: e.message,
          type: 'error'
        })
      })
    },
  }
}
</script>
