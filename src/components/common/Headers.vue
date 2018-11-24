<template>
  <div class="headers">
    <div class="headers_top shadow">
      <div class="headers_top_wrap">
        <div class="headers_top_wrap__left">
          <button class="header_btn" :class="{'header_btn-active' : leftMenuOpen}" @click="toggleLeftMenu"><font-awesome-icon icon="bars"></font-awesome-icon></button>
        </div>

        <div class="headers_top_wrap__center">
          <h1>{{h1}}</h1>
        </div>

        <div class="headers_top_wrap__right">
          <button class="header_btn"><font-awesome-icon icon="bell"></font-awesome-icon></button>
        </div>
        <div class="headers_top_wrap__right">
          <button class="header_btn" @click="logout"><font-awesome-icon icon="sign-out-alt"></font-awesome-icon></button>
        </div>
      </div>
    </div>

    <div class="left_menu">
      <ul class="left_menu__list" :class="{'left_menu__list-active' : leftMenuOpen}">
        <li class="left_menu__item">
          <router-link tag="a" :to="{ path: '/'}" exact active-class="left_menu__link-active" class="left_menu__link">
            <i class="left_menu__icon"><font-awesome-icon icon="home"></font-awesome-icon></i>
            <span class="left_menu__title">Главная</span>
          </router-link>
        </li>
        <li class="left_menu__item">
          <router-link tag="a" :to="{ path: '/tasks'}" exact active-class="left_menu__link-active" class="left_menu__link">
            <i class="left_menu__icon"><font-awesome-icon icon="tasks"></font-awesome-icon></i>
            <span class="left_menu__title">Задачи</span>
          </router-link>
        </li>
        <li class="left_menu__item">
          <router-link tag="a" :to="{ path: '/calendar'}" exact active-class="left_menu__link-active" class="left_menu__link">
            <i class="left_menu__icon">
              <font-awesome-icon icon="calendar-alt"></font-awesome-icon>
            </i>
            <span class="left_menu__title">Календарь</span>
          </router-link>
        </li>
        <li class="left_menu__item">
          <router-link tag="a" :to="{ path: '/money'}" exact active-class="left_menu__link-active" class="left_menu__link">
            <i class="left_menu__icon">
              <font-awesome-icon icon="dollar-sign"></font-awesome-icon>
            </i>
            <span class="left_menu__title">Финансы</span>
          </router-link>
        </li>
        <li class="left_menu__item">
          <router-link tag="a" :to="{ path: '/clients'}" exact active-class="left_menu__link-active" class="left_menu__link">
            <i class="left_menu__icon">
              <font-awesome-icon icon="users"></font-awesome-icon>
            </i>
            <span class="left_menu__title">Клиенты</span>
          </router-link>
        </li>
        <li class="left_menu__item">
          <router-link tag="a" :to="{ path: '/users'}" exact active-class="left_menu__link-active" class="left_menu__link">
            <i class="left_menu__icon">
              <font-awesome-icon icon="user"></font-awesome-icon>
            </i>
            <span class="left_menu__title">Пользователи</span>
          </router-link>
        </li>
        <li class="left_menu__item">
          <a class="left_menu__link" @click="logout">Выход</a>
        </li>
      </ul>
      <div class="left_menu__overlay" :class="{'left_menu__overlay-active' : leftMenuOpen}" @click="toggleLeftMenu"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Headers',
  props: ['h1', 'main_menu'],

  data() {
    return {
      leftMenuOpen: false,
    }
  },

  computed: {
  
  },

  methods: {
    logout(){
      localStorage.removeItem('token')
      return this.$router.push('/')
    },


    toggleLeftMenu(){
      this.leftMenuOpen = !this.leftMenuOpen
    }
  },


  created() {

  },


  mounted(){
    // if(this.token == null) return this.$router.push('/')

  }
}
</script>

<style lang="scss">
.h1, h1 { margin-bottom: 0; line-height: 50px; }
.headers { 
  position: fixed; margin: auto; top: 0; right: 0; left: 0; z-index: 100; 

  &_top { background-color: #455A64; color: #CFD8DC; position: relative; z-index: 10; }
  &_bottom { background-color: #607D8B; }
}

.headers_top_wrap { 
  display: flex; justify-content: flex-start; 

  &__left { margin-right: 1em; }
  &__right { margin-left: 1em; }
  &__center { margin-right: auto; }
}

.headers_top_wrap__right + .headers_top_wrap__right { margin-left: 0; }

.header_btn { 
  padding: 0; width: 52px; height: 52px; line-height: 52px; text-align: center; border: 0 none; box-shadow: none; border-radius: 0; transition: all .3s ease; color: #CFD8DC; 

  &-active { box-shadow: 0 0 6px 3px rgba(0,0,0,0.08) inset; background-color: rgba(0,0,0,0.04); color: #fff; }
  &:hover { color: #fff; }
  &:active { color: #fff; background-color: rgba(255,255,255,.2); }
}

.left_menu__list { 
  position: fixed; margin: auto; left: -240px; top: 52px; bottom: -52px; padding-bottom: 52px; width: 240px; z-index: 9; transition: all .3s ease; background-color: #CFD8DC; 

  &-active { transform: translateX(240px); box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12) !important; }
}

.left_menu__overlay { 
  position: fixed; margin: auto; left: 0; top: 52px; right: 0; bottom: -52px; z-index: 8; background-color: rgba(0,0,0,0.6); opacity: 0; visibility: hidden; transition: all .3s ease; 

  &-active { opacity: 1; visibility: visible; }
}

.left_menu__item { display: block; }
.left_menu__icon { width: 2em; text-align: center; display: inline-block; }
.left_menu__link { 
  display: block; padding: 10px 10px; cursor: pointer;

  &:hover { background-color: rgba(255,255,255,.3); }
  &:active { color: #212121; background-color: rgba(255,255,255,.7);; }
  &-active { background-color: #fff; }
}
</style>
