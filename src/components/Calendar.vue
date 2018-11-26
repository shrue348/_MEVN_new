<template>
  <div class="main">
    <headers :h1="'Календарь'" :mainMenu="true">
    </headers>

    <div class="wrapper">
      <vue-tuicalendar
        ref="calendar"
        :options="calendarOptions"
        :schedules="schedules"
        @after-render-schedule="calendarAfterRender"
        @before-render-schedule="calendarBeforeRender"
        @click-schedule="calendarClickSchedule"
      >
      </vue-tuicalendar>

    </div>
  </div>
</template>

<script>
  import host from '../data/host.js'
  import Headers from './common/Headers'
  import Modal from './common/Modal'

  export default {
    name: 'Calendar',

    components: {
      Headers,
      Modal
    },

    data() {
      return {
        host: host,

        calendarOptions: {
          location: 'ru',
          taskView: [],
          scheduleView: ['time']
        },

        schedules: [
          {
            id: "1",
            calendarId: "1",
            title: "A schedule",
            category: "time",
            dueDateClass: "",
            start: "2018-05-22T22:30:00+09:00",
            end: "2018-05-23T02:30:00+09:00"
          },
          {
            id: "2",
            calendarId: "1",
            title: "Another schedule",
            category: "time",
            dueDateClass: "",
            start: "2018-05-23T17:30:00+09:00",
            end: "2018-05-24T17:31:00+09:00",
            isReadOnly: true
          }
        ]

      }
    },

    sockets: {

    },

    computed: {

    },

    methods: {
      calendarBeforeRender(){},

      calendarAfterRender(){},

      calendarClickSchedule(){}
    },

    created() {
      document.title = 'CRM | Календарь'
    }
  }
</script>

<style lang="scss" scoped>

</style>