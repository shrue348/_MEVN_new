<template>
  <div class="main">
    <headers
      :h1="'Главная'"
      :mainMenu="true"
    >
    </headers>

    <div class="wrapper">

          
      <div class="txt">
        <p>- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

        <ul>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
        </ul>

        <ol>
          <li>123</li>
          <li>123</li>
          <li>123</li>
          <li>123</li>
        </ol>


        <table>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
        </table>

        <button class="btn">Standart</button>
        <button class="btn btn_red">Red</button>
        <button class="btn btn_green">Green</button>
        <button class="btn btn_orange">Orange</button>
        <button class="btn btn_purple">Purple</button>
        <button class="btn btn_white">White</button>
        <button class="btn btn_blank">Blank</button>
      </div>
    </div>
  </div>
</template>

<script>
import Headers from './common/Headers'

export default {
  name: 'Main',

  components: {
    Headers
  },

  data () {
    return {

    }
  },

  sockets:{
   
  },

  computed: {

  },

  methods: {
    
  },

  created(){
    document.title = 'CRM | Главная'
    // this.$socket.emit('login', true, 'blalbalba');
  }
}
</script>

<style lang="scss" scoped>
  .reactive_data {
    margin-bottom: 3em;
    display: flex;
    justify-content: flex-start;

    &.item {
      margin-right: 3em;
    }
  }

  .filter {
    margin-bottom: 30px; border-top: 1px solid #efefef;

    &_item { padding: 10px 15px 10px 30px; border-bottom: 1px solid #efefef; cursor: pointer; position: relative;}
    &_item:hover { background-color: #f2f2f2; }
    &_item:active { background-color: #f7f7f7; }
    &_item:before { content: ''; position: absolute; margin: auto; left: 11px; top: 0; bottom: 0; width: 6px; height: 6px; border-radius: 6px; }
    &_item-active:before { display: none; }

    &_item-data1:before { background-color: rgba(180,180,13,1); }
    &_item-data2:before { background-color: rgba(70,140,60,1); }
  }
</style>
