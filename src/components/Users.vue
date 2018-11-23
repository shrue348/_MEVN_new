<template>
  <div class="main">
    <headers
      :h1="'Пользователи'"
      :mainMenu="true"
    ></headers>

    <div class="wrapper">
      <div class="btn_block">
        <button class="btn btn_green" @click="addNewUserModal"><font-awesome-icon icon="plus"></font-awesome-icon> Создать</button>
        <div class="searchbar form"><input type="text" placeholder="Поиск..."> <button><font-awesome-icon icon="search"></font-awesome-icon></button></div>
        <a href="#" class="btn btn_orange btn_round btn_icon mgla"><font-awesome-icon icon="bars"></font-awesome-icon></a>
      </div>

      <div class="loading" v-if="userListLoader"></div>
      <div class="user_list" v-else>
        <div class="user_item" v-for="user in userSortedList">
          <img class="user_item__img" src="https://cdn.dribbble.com/users/16041/avatars/small/e6c7fac4033b9c233a3bd82ce55c4430.jpg" alt="">
          <div class="user_item__info">
            <div class="wbl">
              <div class="user_item__name">
                <font-awesome-icon v-if="user.role == 'admin'" icon="fire" class="colorred mgr10"></font-awesome-icon> 
                <font-awesome-icon v-if="user.role == 'director'" icon="fire" class="colorgreen mgr10"></font-awesome-icon> 
                {{user.lastName}} {{user.name}}
              </div>
              <a href="#" class="user_item__edit" @click="editUser(user._id)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon> Редактировать</a>
            </div>
            <div class="wbl font14">
              <div class="user_item__props">
                <div class="user_item__prop_line">Телефон: {{user.phone}}</div>
                <div class="user_item__prop_line">Должность: {{user.position}}</div>
                <div class="user_item__prop_line">Заметка: {{user.note}}</div>
              </div>
            </div>
            <div class="wbl font12">
              <div class="colorgrey mgla mgr20">Отредактировано: {{user.updated_date|friendlyDate}}</div>
              <div class="colorgrey"><span v-if="user.active" class="colorgreen b">Активный</span><span v-else class="colorred b">Отключен</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- <masked-input v-model="phone" mask="\+\1 (111) 1111-11" placeholder="Phone" />regre<br> -->
    </div><!--/wrapper-->

    <modal v-if="showAddUserModal">
      <template slot="header"><div class="modal_title">Добавить пользователя</div></template>
      <template slot="body">
        <div class="form-group-material">
          <input type="text" required v-model="newUserModal.userData.login">
          <div class="form-group-material-highlight"></div>
          <label>Логин *</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="newUserModal.userData.password">
          <div class="form-group-material-highlight"></div>
          <label>Пароль</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="newUserModal.userData.lastName">
          <div class="form-group-material-highlight"></div>
          <label>Фамилия</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="newUserModal.userData.name">
          <div class="form-group-material-highlight"></div>
          <label>Имя</label>
        </div>
        <div class="form-group-material">
          <masked-input type="text" required v-model="newUserModal.userData.phone" mask="\+\7 (111) 1111-11" />
          <div class="form-group-material-highlight"></div>
          <label>Телефон</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="newUserModal.userData.position">
          <div class="form-group-material-highlight"></div>
          <label>Должность</label>
        </div>
        <div class="form-group-material">
          <select required v-model="newUserModal.userData.role">
            <option v-for="(value, key) in roleList" :value="key">{{value.titleRu}}</option>
          </select>
          <div class="form-group-material-highlight"></div>
          <label>Роль</label>
        </div>
        <div class="form-group-material">
          <label class="check-switch mgr10 valignmiddle"><input type="checkbox" v-model="newUserModal.userData.active"><div class="track"><div class="knob"></div></div></label>
          <span class="check-switch-desc">
            Активировать <br><span class="colorgrey font12 lh1">Чтобы удалить пользователя деактивируйте его</span>
          </span>
        </div>
        <div class="form-group-material">
          <textarea type="text" required v-model="newUserModal.userData.note" rows="4"></textarea>
          <div class="form-group-material-highlight"></div>
          <label>Заметка</label>
        </div>
      </template>      
      <template slot="footer">
        <button class="btn btn_blank btn_noup modal_close" @click="showAddUserModal = false">Отмена</button>
        <button class="btn" :disabled="newUserModal.userData.login.length == 0" @click="addNewUser">Создать</button>
      </template>
    </modal>

    <modal v-if="showEditUserModal">
      <template slot="header"><div class="modal_title">Редактировать пользователя</div></template>
      <template slot="body">
        <div class="form-group-material">
          <input type="text" required v-model="editUserModal.userData.login">
          <div class="form-group-material-highlight"></div>
          <label>Логин</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="editUserModal.userData.password">
          <div class="form-group-material-highlight"></div>
          <label>Пароль</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="passwordRepeat">
          <div class="form-group-material-highlight"></div>
          <label>Повторите пароль <span class="colorred none">(пароли не совпадают)</span></label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="editUserModal.userData.lastName">
          <div class="form-group-material-highlight"></div>
          <label>Фамилия</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="editUserModal.userData.name">
          <div class="form-group-material-highlight"></div>
          <label>Имя *</label>
        </div>
        <div class="form-group-material">
          <masked-input type="text" required v-model="editUserModal.userData.phone" mask="\+\7 (111) 1111-11" />
          <div class="form-group-material-highlight"></div>
          <label>Телефон</label>
        </div>
        <div class="form-group-material">
          <input type="text" required v-model="editUserModal.userData.position">
          <div class="form-group-material-highlight"></div>
          <label>Должность</label>
        </div>
        <div class="form-group-material">
          <select required v-model="editUserModal.userData.role">
            <option v-for="(value, key) in roleList" :value="key">{{value.titleRu}}</option>
          </select>
          <div class="form-group-material-highlight"></div>
          <label>Роль</label>
        </div>
        <div class="form-group-material">
          <label class="check-switch mgr10 valignmiddle"><input type="checkbox" v-model="editUserModal.userData.active">
            <div class="track">
              <div class="knob"></div>
            </div>
          </label>
          <span class="check-switch-desc">
            Активировать <br><span class="colorgrey font12 lh1">Чтобы удалить пользователя деактивируйте его</span>
          </span>
        </div>
        <div class="form-group-material">
          <textarea type="text" required v-model="editUserModal.userData.note" rows="4"></textarea>
          <div class="form-group-material-highlight"></div>
          <label>Заметка</label>
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn_red btn_noup mgra" @click="deleteUser(editUserModal.userData._id)" :disabled="editUserModal.userData.active">Удалить</button>
        <button class="btn btn_blank btn_noup modal_close" @click="showEditUserModal = false">Отмена</button>
        <button class="btn" :disabled="disabledSaveUser" @click="saveUser(editUserModal.userData._id)">Сохранить</button>
      </template>
    </modal>


    <datepicker 
      placeholder="Выберите дату" 
      :language="datePicker.ru" 
      :format="datePickerFormat" 
      v-model="datePicker.date" 
      :monday-first="true" 
      :highlighted="datePicker.highlighted"
    ></datepicker>

  </div>
</template>

<script>
import host from '../data/host.js'
import Headers from './common/Headers'
import Modal from './common/Modal'
import VmEditor from 'vm-editor'
import MaskedInput from 'vue-masked-input'
import Datepicker from 'vuejs-datepicker'
import { ru } from 'vuejs-datepicker/dist/locale'


export default {
  name: 'Users',

  components: {
    Headers,
    Modal,
    VmEditor,
    MaskedInput,
    Datepicker
  },

  data () {
    return {
      phone: '',
      showAddUserModal: false,
      passwordRepeat: '',
      newUserModal: {
        title: 'Добавить пользователя',
        userData: {
          login: '',
          password: '',
          name: '',
          lastName: '',
          phone: '',
          position: '',
          role: 'user',
          active: true,
          note: ''
        }
      },
      showEditUserModal: false,
      editUserModal: {},
      userList: [],
      userListLoader: false,
      roleList: {
        admin: {
          id: 0,
          titleRu: 'Администратор'
        },
        user: {
          id: 1,
          titleRu: 'Пользователь'
        },
        director: {
          id: 2,
          titleRu: 'Руководитель'
        }
      },
      
      datePicker: {
        ru: ru,
        date: '',
        highlighted: {
          days: []
        }
      }
    }
  },

  sockets:{

  },

  computed: {
    userSortedList(){
      return this.userList.sort((min, max)=>{
        return min.name - max.name
      })
    },

    disabledSaveUser(){
      return (this.editUserModal.userData.password.length > 0 || this.passwordRepeat.length > 0) && this.editUserModal.userData.password != this.passwordRepeat
    },
  },

  methods: {
    datePickerFormat(){
      let dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
          dayNum   = this.datePicker.date.getDay()

      this.datePicker.highlighted.days.length = 0
      this.datePicker.highlighted.days.push(dayNum)
      return dayNames[dayNum]
    },



    getHtml: function (data) {
      //data contains html string for render
    },

    addNewUserModal(){
      this.showAddUserModal = true
    },

    getAllUsers(){
      this.userListLoader = true
      this.$http.get(`${host.host}/user`, {
        headers: {
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.userListLoader = false
        this.userList = response.body
      }, response => {
        this.userListLoader = false
      })
    },

    addNewUser(){
      this.$http.post(`${host.host}/user`, this.newUserModal.userData , {
        headers: {
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.getAllUsers()
      }, response => {
      })

      this.newUserModal.userData = {
        name: '',
        lastName: '',
        phone: '',
        position: '',
        role: 1,
        active: true,
        note: ''
      }
      this.showAddUserModal = false
    },

    editUser(id){
      this.$http.get(`${host.host}/user/${id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.editUserModal.userData = response.body
        this.showEditUserModal = true
      }, response => {
        
      })
    },

    saveUser(id){
      let obj = {
        login: this.editUserModal.userData.login,
        password: this.editUserModal.userData.password,
        name: this.editUserModal.userData.name,
        lastName: this.editUserModal.userData.lastName,
        phone: this.editUserModal.userData.phone,
        position: this.editUserModal.userData.position,
        role: this.editUserModal.userData.role,
        active: this.editUserModal.userData.active,
        note: this.editUserModal.userData.note,
        updated_date: Date.now()
      }

      this.$http.put(`${host.host}/user/${id}`, obj, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.showEditUserModal = false
        this.getAllUsers()
      }, response => {
        
      })
    },

    deleteUser(id) {
      this.$http.delete(`${host.host}/user/${id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.showEditUserModal = false
        this.getAllUsers()
      }, response => {
        
      })
    }
  },

  created(){
    document.title = 'CRM | Пользователи'

    this.getAllUsers()
  },

  mounted(){
    this.$on('modalClose', function(props) {
      this.showUserModal = false
    })
  }
}
</script>

<style lang="scss" scoped>


.user_item {
  padding: .5em 1em; transition: all .2s ease; margin-bottom: 1em; background-color: #fff; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08); display: flex; align-items: flex-start;
  &:hover { background-color: #f7f7f7; }
}
.user_item__info { flex: 1 1 auto; }
.user_item__name { font-weight: bold; font-size: 1.1em; }
.user_item__edit { 
  color: #888; font-size: .8em; margin-left: auto; 
  &:hover { text-decoration: underline; }
}
.user_item__props { color: #444; }
.user_item__img { border-radius: 100px; margin-right: 1.5em; margin-top: .5em; box-shadow: 0 0 0 .3em #fff, 0 0 0 .33em #ccc; }

</style>







































