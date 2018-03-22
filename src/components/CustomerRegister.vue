<template>
<span>
  <div class="container pt-5">

    <div class="card">
      <div class="card-header text-center">
        <h3>Register</h3>
      </div>
      <div class="card-body">
        <form v-on:submit.prevent="submitRegistration">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" name="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" name="password" id="password" v-model="password" required />
          </div>
          <div class="form-group">
            <label for="password_confirm">Password Confirmation</label>
            <input type="password" class="form-control" name="password_confirm" id="password_confirm" v-model="password_confirm" required />
          </div>

          <div class="form-group">
            <label for="username">Name</label>
            <input type="text" class="form-control" name="username" id="username" v-model="username" required />
          </div>

          <div class="form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" class="form-control" name="dob" id="dob" v-model="dob" required />
          </div>
            <button type="submit" class="btn btn-success btn-lg btn-block" :disabled="loading">Sign Up
              <loader class="button-loader" :loading="loading" :color="loaderColor" :size="loaderSize"></loader>
            </button>
        </form>
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
import axios from 'axios'
import swal from 'sweetalert2'
import Loader from 'vue-spinner/src/PulseLoader.vue'
export default {
  components: {
    Loader
  },
  data: function () {
    return {
      loading: false,
        loaderColor: '#fff',
        loaderSize: '6px',
      email: "",
      password: "",
      password_confirm: "",
      username: "",
      dob: "",
      test: this.$store.state.helloTest

    };
  },
  methods: {
      submitRegistration(){
        /* eslint-disable no-console */
        this.loading = true
        axios.post(process.env.VUE_APP_API_URL+'/Customer/Register', this.$data)
        .then(response => {
          this.loading = false
          if (!response.data.error) {
            if (response.data.success) {
              swal({
                title: 'Registration Complete',
                text: 'We\'ve saved your credentials',
                type: 'success'
              }).then((result) => {
                if (result.value) {
                  // TODO: after succcesful registration, instead of redirecting to login screen, redirect to home screen with user set
                  this.$router.push('CustomerLogin')
                }
              })
            } else {
              swal({
                title: 'Registration Failed',
                text: 'Looks like those credentials are in use',
                type: 'error'
              })
            }
          }
        })
        .catch((e) => {
          this.loading = false
          console.log(e)})
        /* eslint-enable no-console */
      }
  }
}
</script>
