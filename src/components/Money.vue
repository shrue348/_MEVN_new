<template>
  <div class="main">
    <headers :h1="'Финансы'" :mainMenu="true">
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
    name: 'Money',

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
      document.title = 'CRM | Финансы'
    }
  }
</script>

<style lang="scss" scoped>

</style>