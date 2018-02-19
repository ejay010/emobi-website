<template>
<div class="container">
<div class="row">
  <div class="col-lg">
    <div v-show="!validCreds" :class="wrongCreds" role="alert">
      Username or password not found...
    </div>
      <form v-on:submit.prevent="submitLoginData">
        <div class="from-group">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" class="form-control" v-model="email" required/>
        </div>

        <div class="from-group">
          <label for="password">Password</label>
          <input type="password" name="password" id="password" class="form-control" v-model="password" required/>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary">Sign In</button>
          <router-link :to="{ name: 'CustomerRegister', params: {} }">Register here</router-link>
        </div>
      </form>
  </div>
</div>
</div>
</template>

<style>

</style>

<script>
// import axios from 'axios';
import swal from 'sweetalert2';
export default {
  data: function (){
    return {
      email: "",
      password: "",
      validCreds: true,
      test: this.$store.state.helloTest
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
      /* eslint-disable no-console */
      this.$store.dispatch('LoginUser', this.$data).then(response => {
        console.log(response);
        if (response.success) {
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
              this.$router.push({ name: 'HomePage'})
            }
          })
        }
      });

      /* eslint-enable no-console */
    }
  }
}
</script>
