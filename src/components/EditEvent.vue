<template>
<div class="container">
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <h3 class="card-header">
          {{ eventObj.title }}
        </h3>
        <div class="card-body">
          <form enctype="multipart/form-data" v-on:submit.prevent="submitChanges">
            <div class="form-group">
              <label for="eventName">Title</label>
              <input type="text" name="eventName" id="eventName" class="form-control" v-model="eventObj.title" />
            </div>

            <div class="form-group">
              <label for="eventPurpose">Event Purpose</label>
              <select class="form-control" name="eventPurpose" id="eventPurpose" v-model="eventObj.category">
                <option value="casual_social">
                  Casual Social
                </option>
                <option value="networking">
                  Networking
                </option>
                <option value="spiritual">
                  Spiritual
                </option>
                <option value="party">
                  Party
                </option>
                <option value="education">
                  Education
                </option>
                <option value="fitness">
                  Fitness
                </option>
              </select>
            </div>

            <label>Start Date & time</label>
            <div class="form-row">
              <div class="form-group">
                <label for="startMonth">Month</label>
                <select name="startMonth" id="startMonth" class="form-control" v-model="startTime.month">
                  <option v-for="option in Months.options" v-bind:value="option.value" v-bind:key="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startDate">Date</label>
                <select name="startDate" id="startDate" class="form-control" v-model="startTime.date">
                  <option v-for="option in StartDays.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startYear">Year</label>
                <select name="startYear" id="startYear" class="form-control" v-model="startTime.year">
                  <option v-for="option in Years.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startHour">Hour</label>
                <select name="startHour" id="startHour" class="form-control" v-model="startTime.hour">
                  <option v-for="option in Hours" :key="option.value" :value="option.value">
                    {{option.name}}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startMinutes">Minute</label>
                <select name="startMinutes" id="startMinutes" class="form-control" v-model="startTime.min">
                  <option v-for="option in Minutes" :key="option.value" :value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startTimeAMPM">AM/PM</label>
                <select name="startTimeAMPM" id="startTimeAMPM" class="form-control" v-model="startTime.amPm">
                  <option value="AM">
                    AM
                  </option>
                  <option value="PM">
                    PM
                  </option>
                </select>
              </div>
            </div>


            <label>Finish Date & time</label>
            <div class="form-row">
              <div class="form-group">
                <label for="finishMonth">Month</label>
                <select name="finishMonth" id="finishMonth" class="form-control" v-model="finishTime.month">
                  <option v-for="option in Months.options" v-bind:value="option.value" v-bind:key="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="finishDate">Date</label>
                <select name="finishDate" id="finishDate" class="form-control" v-model="finishTime.date">
                  <option v-for="option in FinishDays.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="finishYear">Year</label>
                <select name="finishYear" id="finishYear" class="form-control" v-model="finishTime.year">
                  <option v-for="option in Years.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="finishHour">Hour</label>
                <select name="finishHour" id="finishHour" class="form-control" v-model="finishTime.hour">
                  <option v-for="option in Hours" :key="option.value" :value="option.value">
                    {{option.name}}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="finishMinutes">Minute</label>
                <select name="finishMinutes" id="finishMinutes" class="form-control" v-model="finishTime.min">
                  <option v-for="option in Minutes" :key="option.value" :value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="finishTimeAMPM">AM/PM</label>
                <select name="finishTimeAMPM" id="finishTimeAMPM" class="form-control" v-model="finishTime.amPm">
                  <option value="AM">
                    AM
                  </option>
                  <option value="PM">
                    PM
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group" v-if="existingFlyer.exists">
                <label for="currentflyer" v-if="existingFlyer.exists">Current Flyer</label>
                <img class="card" v-if="existingFlyer.exists" v-bind:src="existingFlyer.src" name="currentflyer" id="currentflyer"/>
            </div>
            <div class="form-group">
                <label for="flyer" v-if="existingFlyer.exists">Change Flyer</label>
                <label for="flyer" v-else>The Flyer</label>
              <input type="file" name="flyer" id="flyer" class="form-control" v-on:change="fileSelected" accept="image/*"/>
            </div>

            <div class="from-group">
              <label for="eventDescription">Event Description</label>
              <textarea name="eventDescription" id="eventDescription" class="form-control" v-model="eventObj.description"></textarea>
            </div>

            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert2'
export default {
  data() {
    return {
      user: this.$store.state.user,
      eventObj: {},
      imageFile: {},
      startTime: {
        year: moment().year(),
        month: moment().month(),
        date: moment().date(),
        hour: 12,
        min: 0,
        amPm: "AM"
      },
      finishTime: {
        year: moment().year(),
        month: moment().month(),
        date: moment().date(),
        hour: 12,
        min: 0,
        amPm: 'AM'
      }
    };
  },
  created: function() {
    /* eslint-disable no-console */
    let eventData = this.$store.getters.userEventByKey(this.$route.params.eventkey);
    this.eventObj = eventData
    /* eslint-enable no-console */
  },
  computed: {
    existingFlyer() {
      if (this.eventObj.flyer != null) {
        let rawData = JSON.parse(this.eventObj.flyer)
        rawData.exists = true
        rawData.src = process.env.VUE_APP_API_URL+'/'+rawData.filename+'-'+rawData.originalname
        return rawData
      } else {
        return {
          exists: false
        }
      }
    },
    //Shared variable
    Years() {
      let currentYear = moment().year()
      let optionsArray = []
      for (var i = currentYear; i <= currentYear + 10; i++) {
        optionsArray.push({
          value: i,
          name: i
        })
      }
      let obj = {
        selectedYear: currentYear,
        options: optionsArray
      }
      return obj;
    },
    //Shared variable
    Months() {
      let currentMonth = moment().month()
      let obj = {
        selectedMonth: currentMonth,
        options: [
          {value: 0, name: "January"},
          {value: 1, name: "February"},
          {value: 2, name: "March"},
          {value: 3, name: "April"},
          {value: 4, name: "May"},
          {value: 5, name: "June"},
          {value: 6, name: "July"},
          {value: 7, name: "August"},
          {value: 8, name: "September"},
          {value: 9, name: "October"},
          {value: 10, name: "November"},
          {value: 11, name: "December"}
        ]
      }
      return obj
    },
    /* eslint-disable no-console */
    StartDays() {
      let optionsArray = []
      let month = this.startTime.month + 1
      for (var i = 1; i <= moment(this.startTime.year+'-'+month, "YYYY-MM").daysInMonth(); i++) {
        optionsArray.push({
          value: i, name: i
        })
      }

      let currentDate = moment().date()
      let obj = {
        selectedDate: currentDate,
        options: optionsArray
      }
      return obj;
    },
    /* eslint-disable no-console */
    FinishDays() {
      let optionsArray = []
      let month = this.startTime.month + 1
      for (var i = 1; i <= moment(this.finishTime.year+'-'+month, "YYYY-MM").daysInMonth(); i++) {
        optionsArray.push({
          value: i, name: i
        })
      }

      let currentDate = moment().date()
      let obj = {
        selectedDate: currentDate,
        options: optionsArray
      }

      return obj;
    },
    Minutes() {
      let optionsArray = []
      for (var i = 0; i < 60; i++) {
        if (i < 10) {
          optionsArray.push({
            value: i,
            name: '0'+i
          })
        } else {
          optionsArray.push({
            value: i,
            name: i
          })
        }
      }
      return optionsArray;
    },
    Hours() {
      let optionsArray = []
      for (var i = 1; i <= 12; i++) {
        optionsArray.push({
          value: i, name: i
        })
      }
      return optionsArray;
    },
    eventStartTimestamp(){
      let year = this.startTime.year;
      let month = this.startTime.month + 1;
      if (month <= 9) {
        month = '0'+month
      }
      let day = this.startTime.date;
      if (day <= 9) {
        day = '0'+day
      }
      let dateString = year+'-'+month+'-'+day;
      // moment().utc()
      let minute = this.startTime.min;
      let hour = this.startTime.hour;
      if (hour <= 9) {
        hour = '0'+hour
      }
      let am_pm = this.startTime.amPm;
      if (minute <= 9) {
        minute = '0'+minute;
      }
      let timeString = hour+':'+minute+':00'+' '+am_pm

      let timeStampString = dateString+' '+timeString
      // return timeStampString
      return moment.utc(timeStampString, 'YYYY-MM-DD hh:mm:ss a', true).format()
    },
    eventFinishTimestamp(){
        let year = this.finishTime.year;
        let month = this.finishTime.month + 1;
        if (month <= 9) {
          month = '0'+month
        }
        let day = this.finishTime.date;
        if (day <= 9) {
          day = '0'+day
        }
        let dateString = year+'-'+month+'-'+day;
        // moment().utc()
        let minute = this.finishTime.min;
        let hour = this.finishTime.hour;
        if (hour <= 9) {
          hour = '0'+hour
        }
        let am_pm = this.finishTime.amPm;
        if (minute <= 9) {
          minute = '0'+minute;
        }
        let timeString = hour+':'+minute+':00 '+am_pm

        let timeStampString = dateString+' '+timeString
        // return timeStampString;
        return moment.utc(timeStampString, 'YYYY-MM-DD hh:mm:ss a', true).format()
    }
  },
  methods: {
/* eslint-disable no-console */
  fileSelected(evt){
    let image = evt.target.files || evt.dataTransfer.files
    this.imageFile = image
  },

    submitChanges(){
      const formData = new FormData();
      if (this.$data.imageFile[0] != null) {
        formData.append('flyer', this.$data.imageFile[0], this.$data.imageFile[0].name);
      }
      let data = this.$data;
      data.startTimestamp = this.eventStartTimestamp;
      data.finishTimestamp = this.eventFinishTimestamp;

      formData.append('seedData', JSON.stringify(data))
      let post_url = process.env.VUE_APP_API_URL+'/events/'+this.$data.eventObj._id+'/edit'
      axios({
        url: post_url,
        method: 'POST',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'mutlipart/form-data'
        }
      }).then(response => {
        if (response.data.success) {
          this.$store.dispatch('UpdateEvents', response.data.recieved)
          swal({
            title: 'Event Updated',
            text: 'Changes saved',
            type: 'success'
          }).then((response) => {
            if (response) {
              this.$router.push({name:'CustomerEventList'})
            }
          })
        } else {
          swal({
            title: 'Something Went Wrong',
            text: response.data.message,
            type: 'error'
          })
        }
      }).catch(e => {
        console.log(e);
        swal({
          title: 'Something Went Wrong',
          text: e.message,
          type: 'error'
        })
      })
    }
    /* eslint-enable no-console */
  }
}
</script>

<style>

</style>
