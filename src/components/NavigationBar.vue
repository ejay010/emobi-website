<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <router-link class="navbar-brand mb-0 h1" :to="{ name: 'HomePage', params: {} }">E-mobi</router-link>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link">Entertainment</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Outdoor Adventures</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">
          Water Sports
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Everything else...</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
    </form>
    <router-link v-if="!LoggedIn" class="btn btn-outline-success" :to="{ name: 'CustomerLogin', params: {} }">Sign In</router-link>
    <router-link v-if="LoggedIn" class="btn btn-outline-success" :to="{name: 'Customer', params: {email: customer.email} }">
      <!-- {{customer.username}} -->
      <icon name="home" class="icon-mod"></icon>
    </router-link>
  </div>
</nav>
</template>

<style>
.icon-mod {
  vertical-align: middle;
  width: 25px;
  height: 25px;
}
</style>

<script>
export default {
  computed: {
    LoggedIn (){
      return this.$store.getters.userLoggedIn
    },
    customer (){
      return this.$store.state.user;
    }
  },
}
</script>
