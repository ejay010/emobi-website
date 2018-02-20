<template>
<span>
  <div class="container">

    <div class="card">
      <div class="card-header">
        Register
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

          <div class="form-group">
            <button type="submit" class="btn btn-success">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</span>
</template>

<style>

</style>

<script>
import axios from 'axios'
import swal from 'sweetalert2'
export default {
  data: function () {
    return {
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
        axios.post('http://api.e-mobie.com:3000/customerRegister', this.$data)
        .then(response => {
          if (!response.data.error) {
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
          }
        })
        .catch(e => console.log(e))
        /* eslint-enable no-console */
      }
  }
}
</script>
