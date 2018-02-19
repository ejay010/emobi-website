<template>
<div class="container">
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <h3 class="card-header">
          {{ eventTitle }}
        </h3>
        <div class="card-body">
          <form enctype="multipart/form-data" v-on:submit.prevent="submitChanges">
            <div class="form-group">
              <label for="eventName">Title</label>
              <input type="text" name="eventName" id="eventName" class="form-control" v-model="eventTitle" />
            </div>

            <div class="form-group">
              <label for="eventPurpose">Event Purpose</label>
              <select class="form-control" name="eventPurpose" id="eventPurpose">
                <option>
                  Option
                </option>
              </select>
            </div>

            <label>Start Date & time</label>
            <div class="form-row">
              <div class="form-group">
                <label for="startMonth">Month</label>
                <select name="startMonth" id="startMonth" class="form-control" v-model="startTime.month">
                  <option v-for="option in initMonth.options" v-bind:value="option.value" v-bind:key="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startDate">Date</label>
                <select name="startDate" id="startDate" class="form-control" v-model="startTime.date">
                  <option v-for="option in initStartDates.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startYear">Year</label>
                <select name="startYear" id="startYear" class="form-control" v-model="startTime.year">
                  <option v-for="option in initYear.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startTimeHH">Hour</label>
                <select name="startTimeHH" id="startTimeHH" class="form-control" v-model="startTime.hour">
                  <option v-for="option in initTimeHH" :key="option.value" :value="option.value">
                    {{option.name}}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startTimeMM">Minute</label>
                <select name="startTimeMM" id="startTimeMM" class="form-control" v-model="startTime.min">
                  <option v-for="option in initTimeMM" :key="option.value" :value="option.value">
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
                <label for="startMonth">Month</label>
                <select name="startMonth" id="startMonth" class="form-control" v-model="finishTime.month">
                  <option v-for="option in initMonth.options" v-bind:value="option.value" v-bind:key="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startDate">Date</label>
                <select name="startDate" id="startDate" class="form-control" v-model="finishTime.date">
                  <option v-for="option in initEndDates.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startYear">Year</label>
                <select name="startYear" id="startYear" class="form-control" v-model="finishTime.year">
                  <option v-for="option in initYear.options" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="finishTimeHH">Hour</label>
                <select name="finishTimeHH" id="finishTimeHH" class="form-control" v-model="finishTime.hour">
                  <option v-for="option in initTimeHH" :key="option.value" :value="option.value">
                    {{option.name}}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startTimeMM">Minute</label>
                <select name="startTimeMM" id="startTimeMM" class="form-control" v-model="finishTime.min">
                  <option v-for="option in initTimeMM" :key="option.value" :value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="startTimeAMPM">AM/PM</label>
                <select name="startTimeAMPM" id="startTimeAMPM" class="form-control" v-model="finishTime.amPm">
                  <option value="AM">
                    AM
                  </option>
                  <option value="PM">
                    PM
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="eventFlyer">The Flyer</label>
              <input type="file" name="flyer" class="form-control" v-on:change="fileSelected" accept="image/*"/>
            </div>

            <div class="from-group">
              <label for="eventDescription">Event Description</label>
              <textarea name="eventDescription" id="eventDescription" class="form-control" v-model="eventDescription"></textarea>
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
export default {
  data() {
    return {
      user: this.$store.user,
      eventID: this.$route.params.eventkey,
      eventTitle: "",
      eventDescription: "",
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
    this.eventTitle = eventData.content.title
    if (eventData.content.description) {
      this.eventDescription = eventData.content.description
    }
    /* eslint-enable no-console */
  },
  computed: {
    initYear() {
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

    initMonth() {
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
    initStartDates() {
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
    initEndDates() {
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

    initTimeMM() {
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
    initTimeHH() {
      let optionsArray = []
      for (var i = 1; i <= 12; i++) {
        optionsArray.push({
          value: i, name: i
        })
      }
      return optionsArray;
    },

  },
  methods: {
    fixDate(startOrFinish){
      if (startOrFinish === "start") {
        this.startDate = this.startDate + 1
      }

      if (startOrFinish === "finish") {
        this.finishDate = this.finishDate + 1
      }
    },

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
      formData.append('seedData', JSON.stringify(this.$data))

      axios({
        url: 'http://localhost:3000/editEvent',
        method: 'POST',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'mutlipart/form-data'
        }
      }).then(response => {
        console.log(response);
      }).catch(e => {
        console.log(e.message);
      })
    }
    /* eslint-enable no-console */
  }
}
</script>

<style>

</style>
