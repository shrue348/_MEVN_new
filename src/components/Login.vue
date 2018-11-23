<template>
  <div class="login">

    <div class="login_wrap">
      <!-- <div class="login_logo" style="color: #45566B; font-size: 70px; margin-bottom: .4em; ">ЦРМ</div> -->
      <div class="login_logo">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWMAAABXCAYAAADRXiTuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkZDREQ1MDJFNTVDMTFFOEIxMjlBNDkyMDZFMTRCRTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkZDREQ1MDNFNTVDMTFFOEIxMjlBNDkyMDZFMTRCRTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNzE3NzRGNUU0QzUxMUU4QjEyOUE0OTIwNkUxNEJFOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNzE3NzRGNkU0QzUxMUU4QjEyOUE0OTIwNkUxNEJFOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtdTb1sAAAxaSURBVHja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" alt="CRM">
      </div>

      <form class="login_form" onsubmit="return false">

        <div class="form-group-material">
          <input type="text" required v-model="form.login">
          <div class="form-group-material-highlight"></div>
          <label>Логин</label>
        </div>

        <div class="form-group-material">
          <input type="password" required v-model="form.password">
          <div class="form-group-material-highlight"></div>
          <label>Пароль</label>
        </div>

        <div class="form-group-material">
          <button class="login_btn btn" @click="login" @keyup:enter="login" :disabled="form.login.length == 0 || form.password.length == 0">
            <font-awesome-icon icon="sign-in-alt" class="mgr10"></font-awesome-icon> Войти
          </button>
        </div>
      </form>
    </div>

    <div class="login_copy">
      &copy; shure348 2018
    </div>

  </div>
</template>

<script>
import host from '../data/host.js'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        login: '',
        password: ''
      }
    }
  },

  computed: {
    token() {
      return localStorage.getItem('token')
    }
  },

  methods: {
    login() {
      this.$http.post(`${host.host}/login`, {
        login: this.form.login,
        password: this.form.password
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        // var data = JSON.parse(response.bodyText)
        // localStorage.setItem('token', data.token)
        // return this.$router.push('/' + data.message)
      }, response => {
        // let data = JSON.parse(response.bodyText)
        // this.user = '';
        // this.pass = '';

        // return this.$toastr('error', data.message)
      })
    },

    createAmin(){

    },

    checkAdmin(){
      this.$http.post(`${host.host}/login/checkadmin`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        console.log(response)
      }, response => {
        return this.$toastr('error', data.message)
      })
    }
  },

  created() {
    document.title = 'CRM | Вход'
    this.checkAdmin()

    if (this.token != null) return this.$router.push('/tasks')
  },

  directives: {
    focus: { //автофокус по v-focus
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .5em;
  background-color: #ECEFF1;
  box-sizing: border-box;
  flex-wrap: wrap;
  flex-direction: column;

  &_wrap {
    display: flex;
    flex-direction: column;
    margin-top: auto;
    margin-bottom: auto;
    align-items: center;
  }

  &_logo {
    text-align: center;
    margin-bottom: 4.2em;
  }

  &_form {
    width: 280px;
  }

  &_btn {
    width: 100%;
  }

  &_copy {
    font-size: .8em;
    text-align: center;
  }
}

input { box-shadow: 0 0 0 50px #ECEFF1 inset; }
</style>