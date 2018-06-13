<template>
<span>

    <div class="card">
    <div class="card-header">
      My Settings
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-sm">
          <form>
            <label for="username">Username:</label>
            <input type="text" name="username" id="username" v-model="user.username" class="form-control" />
            <label for="email">
              Email:
            </label>
            <input type="email" name="email" id="email" v-model="user.email" class="form-control" disabled="true">
            <label for="status">
               Status:
             </label>
            <input type="text" id="status" name="status" v-model="user.status" class="form-control">
          </form>
        </div>
        <div class="col-sm">

          <img :src="picture" class="img-thumbnail" />
          <button class="btn btn-secondary" type="button" data-target="#profile_picture_portal" data-toggle="modal" :disabled="loading">Change Picture</button>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm">
          <button type="button" class="btn btn-primary" @click="UpdateUserInfo" :disabled="loading">Save Changes</button>
        </div>
      </div>
    </div>
    </div>

    <div class="modal" tabindex="-1" role="dialog" id="profile_picture_portal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Profile Picture</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-body">
  <form class="form" id="profile_picture_form">
    <label for="new_profile_picture">Upload new Profile Picture</label>
    <input type="file" class="form-control" id="new_profile_picture" name="new_profile_picture" v-on:change="PictureSelected" accept="image/*" :disabled="loading" />
  </form>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="ResetPictureForm" :disabled="loading">Close</button>
  <button type="button" class="btn btn-primary" v-on:click="UploadNewPicture" :disabled="loading">Save Picture</button>
</div>
</div>
</div>
</div>
</span>
</template>

<style>

</style>

<script>
import $ from 'jquery'
import axios from 'axios'
import swal from 'sweetalert2'
export default {
  data: function() {
    return {
      loading: false,
      new_profile_picture: {},
      user: this.$store.state.user.user
    }
  },
  computed: {

    picture() {
      if (this.user.ProfilePic != null) {
        let picObj = JSON.parse(this.user.ProfilePic)
        let picURL = process.env.VUE_APP_API_URL + '/' + picObj.filename + '-' + picObj.originalname
        return picURL
      } else {
        return "http://via.placeholder.com/200x200"
      }
    }
  },

  methods: {

    ResetPictureForm() {
      document.getElementById('profile_picture_form').reset()
      this.new_profile_picture = {}
    },

    UploadNewPicture() {
      this.loading = true
      if (this.new_profile_picture[0].name != null) {
        this.user.profile_picture = this.new_profile_picture[0]

        const formData = new FormData()
        formData.append('new_picture', this.user.profile_picture, this.new_profile_picture[0].name)

        this.$store.dispatch('user/ChangePic', formData).then((response) => {
          if (response.success) {
            $('#profile_picture_portal').modal('hide')
            swal({
              title: "Picture Uploaded",
              text: "Your new picture was saved",
              type: "success"
            })
          }
        }).catch((e) => {
          swal({
            title: "Error",
            text: e.message,
            type: 'error'
          })
        })

        this.loading = false
      }
    },

    PictureSelected(rawData) {
      let image = rawData.target.files || rawData.dataTransfer.files
      this.new_profile_picture = image
    },

    UpdateUserInfo() {
      this.loading = true
      let user = this.user

      this.$store.dispatch('user/Update', user).then((response) => {
        if (response.success) {
          swal({
            title: "Update Complete",
            text: "Info Updated",
            type: "success"
          })
        }
      })

      this.loading = false
    }
  }
}
</script>
