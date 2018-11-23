<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal_header">
            <slot name="header"></slot>
          </div>

          <div class="modal_body">
            <slot name="body"></slot>
          </div>

          <div class="modal_footer clear">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>
export default {
  name: 'Modal',
  props: ['title', 'cancel'],
  data() {
    return {

    };
  },
  computed:{
    showCancelBtn(){
      return this.cancel
    }
  },
  methods: {

  }

}
</script>


<style scoped>

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    max-width: 450px;
    margin: 0px auto;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }

  .wide .modal-container { max-width: 900px;}

  .modal_body { margin: 1.5em 0 2em;}
  .modal_footer { display: flex; justify-content: flex-end; }

  .modal_title { font-size: 23px; }
  .modal_close { margin-right: .6em; }

  .modal-enter { opacity: 0;}
  .modal-leave-active { opacity: 0;}
  .modal-enter .modal-container,
  .modal-leave-active .modal-container { -webkit-transform: scale(1.1); transform: scale(1.1);}

</style>