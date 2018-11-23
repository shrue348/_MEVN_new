<template>
  <div class="main">
    <headers :h1="'Клиенты'" :mainMenu="true">
    </headers>

    <div class="wrapper">


    </div>
  </div>
</template>

<script>
  import host from '../data/host.js'
  import Headers from './common/Headers'
  import Modal from './common/Modal'

  export default {
    name: 'Clients',

    components: {
      Headers,
      Modal
    },

    data() {
      return {
        host: host,

      }
    },

    sockets: {

    },

    computed: {

    },

    methods: {

    },

    created() {
      document.title = 'CRM | Клиенты'
    }
  }
</script>

<style lang="scss" scoped>

</style>