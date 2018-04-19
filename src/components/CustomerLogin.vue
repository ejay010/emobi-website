<template>
<div class="container pt-5">
<div class="row justify-content-center">
  <div class="col-6">
    <div v-show="!validCreds" :class="wrongCreds" role="alert">
      Username or password not found...
    </div>
    <div class="card">
      <div class="card-header text-center">
          <h5>Sign In</h5>
      </div>
        <div class="card-body">
          <form v-on:submit.prevent="submitLoginData">
            <div class="from-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control" v-model="email" required/>
            </div>

            <div class="from-group">
              <label for="password">Password</label>
              <input type="password" name="password" id="password" class="form-control" v-model="password" required/>
            </div>
            <hr/>

            <div class="text-center mb-1">
              <button type="submit" class="btn btn-success btn-sm btn-block" :disabled="loading">Sign In
                <loader class="button-loader" :loading="loading" :color="loaderColor" :size="loaderSize"></loader>
              </button>
            </div>
          </form>
          <div class="text-center">
            <router-link :to="{ name: 'CustomerRegister', params: {} }" class="btn btn-outline-secondary btn-sm btn-block" :class="{disabled: loading}">Sign Up</router-link>
          </div>
        </div>
    </div>
  </div>
</div>
</div>
</template>

<style>
.button-loader {
  display: inline;
}
</style>

<script>
// import axios from 'axios';
import Loader from 'vue-spinner/src/PulseLoader.vue'
import swal from 'sweetalert2';
export default {
  components: {
    Loader
  },
  data: function (){
    return {
      loaderColor: '#fff',
      loaderSize: '6px',
      email: "",
      password: "",
      validCreds: true,
      test: this.$store.state.helloTest,
      loading: false
    };
  },
  computed: {
    wrongCreds: function () {
      if (!this.$data.validCreds) {
        return {
          "alert": !this.$data.validCreds,
          "alert-danger": !this.$data.validCreds
        };
      }
    }
  },
  methods: {
    submitLoginData(){
      this.loading = true
      this.$store.dispatch('LoginUser', this.$data).then(response => {
        console.log(response);
        this.loading = false
        if (response.success) {
          this.$store.dispatch('loadTickets')
          this.$store.dispatch('loadPurchasedTickets')
          this.$data.valdCreds = true;
          swal({
            title: "Welcome!",
            text: this.$store.state.user.email,
            timer: 2300,
            type: 'success',
            showConfirmButton: false
          }).then((result) => {
            if (result.dismiss == "timer") {
              // TODO: update navigation bar, redirect to home.
              if (this.$route.query.redirect != null) {
                this.$router.push(this.$route.query.redirect)
              } else {
                this.$router.push({ name: 'HomePage'})
              }
            }
          })
        }
      }).catch(e => {
        console.log(e);
        this.loading = false
        if (e.status == 401) {
          swal({
            title: e.message,
            text: 'Something is wrong, Credentials not available',
            type: 'error'
          })
        }
      });
    }
  }
}
</script>
