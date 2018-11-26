<template>
  <div class="main">
    <headers :h1="'Задачи'" :mainMenu="true">
    </headers>

    <div class="wrapper">
      <div class="btn_block">
        <button class="btn btn_green" @click="addNewTaskModal"><font-awesome-icon icon="plus"></font-awesome-icon> Создать задачу</button>
        <div class="searchbar form mgr15"><input type="text" placeholder="Поиск..."> <button><font-awesome-icon icon="search"></font-awesome-icon></button></div>

        <label class="check-switch mgr10 valignmiddle"><input type="checkbox">
          <div class="track">
            <div class="knob"></div>
          </div>
        </label>
        <span class="check-switch-desc">
          Созданые мной
        </span>
        <a href="javascript:;" class="btn btn_orange btn_round btn_icon mgla"><font-awesome-icon icon="bars"></font-awesome-icon></a>
      </div>

      <div class="page_row">
        <div class="page_row__center">
          <div class="loading" v-if="taskListLoader"></div>
          <div class="task_list" v-else>
            <div class="task_item" v-for="task in taskListReverse" v-if="taskListReverse.length > 0">
              <div class="task_item__info">
                <div class="wbl task_item__top">
                  <div class="task_item__name">
                    <a href="javascript:;" class="task_item__link" @click="$router.push('tasks/id/'+ task._id)">
                      <font-awesome-icon v-if="task.priority == 1" icon="fire" class="colorred mgr10"></font-awesome-icon>
                      <div v-else class="task_item__priority" :class="'task_item__priority-' + task.priority"></div>
                      {{task.title}}
                    </a>
                  </div>
                  <!-- <a href="javascript:;" class="task_item__edit" @click="editTask(task._id)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon> Редактировать</a> -->
                </div>
                <div class="wbl font14">
                  <div class="task_item__props">
                    <div class="task_item__prop_line mgb5" v-if="task.creator">Постановщик: {{task.creator}}</div>
                    <div class="task_item__prop_line task_item__description" v-if="task.description">{{ task.description | striphtml | truncate(450, '...' )}}</div>
                  </div>
                </div>
                <div class="wbl font12">
                  <div class="colorgrey mgra"><font-awesome-icon icon="comments" class="mgr5"></font-awesome-icon> Комментариев: {{task.commentCount}}</div>
                  <div class="colorgrey mgla mgr20">Создана: {{task.createdAt|friendlyDate}}</div>
                  <div class="colorgrey mgr20" v-if="task.deadLine">Дедлайн: {{task.deadLine|friendlyOnlyDate}}</div>
                  <div class="colorgrey mgr20" v-if="task.updated_date >= task.created_date">Отредактирована: {{task.updatedAt|friendlyDate}}</div>
                  <div class="colorgrey"><span v-if="task.active" class="colorgreen b">Активная</span><span v-else class="colorred b">Неактивная</span></div>
                </div>
              </div>
            </div>

            <p v-if="taskListReverse.length == 0">Список задач пуст</p>
          </div>
        </div>
        <div class="page_row__right">
          <datepicker :inline="true" :language="datePicker.ru" :monday-first="true"></datepicker>
        </div>
      </div>
    </div>


    <modal v-if="showAddTaskModal" class="wide">
      <template slot="header">
        <div class="modal_title">Создать задачу</div>
      </template>
      <template slot="body">
        <div class="form-group-material">
          <input type="text" required v-model="newTaskModal.taskData.title">
          <div class="form-group-material-highlight"></div>
          <label>Название *</label>
        </div>
    
        <div class="row">
          <div class="col-3">
            <div class="form-group-material">
              <select required>
                <option v-for="(value, key) in userList" :value="key">{{value.lastName}} {{value.name}}</option>
              </select>
              <div class="form-group-material-highlight"></div>
              <label>Исполнитель</label>
            </div>
          </div>
          <div class="col-3">
            <div class="form-group-material">
              <select required>
                <option>Продажа</option>
                <option>Поставка</option>
                <option>Сайт</option>
                <option>Продвижение</option>
                <option>Соцсети</option>
              </select>
              <div class="form-group-material-highlight"></div>
              <label>Тип задачи</label>
            </div>
          </div>
          <div class="col-3">
            <div class="form-group-material" >
              <select required v-model="newTaskModal.taskData.priority">
                <option :value="1">Горит!</option>
                <option :value="2">Очень высокий</option>
                <option :value="3">Высокий</option>
                <option :value="4">Стандартный</option>
                <option :value="5">Низкий</option>
                <option :value="6">Очень низкий</option>
              </select>
              <div class="form-group-material-highlight"></div>
              <label>Приоритет</label>
            </div>
          </div>
          <div class="col-3">
            <div class="form-group-material" >
              <datepicker 
                placeholder="Выберите дату" 
                :language="datePicker.ru" 
                v-model="newTaskModal.taskData.deadLine" 
                :monday-first="true" 
                :highlighted="datePicker.highlighted"
              ></datepicker>
              <div class="form-group-material-highlight"></div>
              <label>Дедлайн</label>
            </div>
          </div>
        </div>
        <div class="form-group-material">
          <label class="check-switch mgr10 valignmiddle"><input type="checkbox" v-model="newTaskModal.taskData.active">
            <div class="track">
              <div class="knob"></div>
            </div>
          </label>
          <span class="check-switch-desc">
            Активировать <br><span class="colorgrey font12 lh1">Задача станет видна исполнителю в списке задач и календаре</span>
          </span>
        </div>
        <div class="form-group mgb0">
          <label>Задача</label>
          <quill-editor 
            v-model="newTaskModal.taskData.description"
            ref="myQuillEditor"
            :placeholder="'iejfowiej'"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)">
          </quill-editor>
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn_blank btn_noup modal_close" @click="showAddTaskModal = false">Отмена</button>
        <button class="btn" :disabled="newTaskModal.taskData.title.length == 0" @click="addNewTask">Создать</button>
      </template>
    </modal>
  </div>
</template>

<script>
import host from '../data/host.js'
import Headers from './common/Headers'
import Modal from './common/Modal'
import VmEditor from 'vm-editor'
import Datepicker from 'vuejs-datepicker'
import { en, ru } from 'vuejs-datepicker/dist/locale'


export default {
  name: 'Tasks',

  components: {
    Headers,
    Modal,
    Datepicker
  },

  data() {
    return {
      host: host,
      taskListLoader: false,
      showAddTaskModal: false,
      newTaskModal: {
        title: 'Добавить пользователя',
        taskData: {
          title: '',
          creator: '',
          maker: '',
          linkedUsers: [],
          status: '',
          priority: 4,
          active: true,
          description: '',
          created_date: Date.now(),
          comments: []
        }
      },
      editorOption: {
        placeholder: '',
        modules: {
          
        }
      },
      userList: [],
      taskList: [],
      previewHtml: '',
      datePicker: {
        ru: ru,
        date: '',
        highlighted: {
          days: []
        }
      }
    }
  },

  sockets: {

  },

  computed: {
    token() {
      return localStorage.getItem('token')
    },

    taskListReverse(){
      return this.taskList.reverse()
    }
  },

  methods: {

    onEditorBlur(e){

    },

    onEditorFocus(e) {

    },

    onEditorReady(e){

    },

    addNewTaskModal(){
      this.showAddTaskModal = true
    },

    addNewTask() {
      this.$http.post(`${host.host}/task`, this.newTaskModal.taskData, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': this.token
        }
      }).then(response => {
        this.getAllTasks()
      }, response => {
      })

      this.newTaskModal.taskData = {
        title: '',
        creator: '',
        maker: '',
        linkedUsers: [],
        status: '',
        priority: 4,
        active: true,
        description: '',
        comments: []
      }
      this.showAddTaskModal = false
    },

    getAllTasks(){
      this.taskListLoader = true
      this.$http.get(`${host.host}/task`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': this.token
        }
      }).then(response => {
        this.taskListLoader = false
        this.taskList = response.body
      }, response => {
        this.taskListLoader = false
      })
    },

    editTask(){},

    saveTask(){},

    deleteTask(id){
      this.$http.delete(`${host.host}/task/${id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': this.token
        }
      }).then(response => {
        this.getAllTasks()
      }, response => {

      })
    },

    getAllUsers() {
      this.$http.get(`${host.host}/user`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': this.token
        }
      }).then(response => {
        this.userList = response.body
      }, response => {

      })
    },

  },

  created() {
    document.title = 'CRM | Задачи'

    this.getAllUsers()
    this.getAllTasks()
  }
}
</script>



<style lang="scss" scoped>
.task_item {
  padding: .5em 1em; transition: all .2s ease; margin-bottom: .66em; background-color: #fff; /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08); */ display: flex; align-items: flex-start;
  &:hover { background-color: #f7f7f7; }
}
.task_item__top { display: flex; align-items: flex-start; flex-wrap: nowrap; }
.task_item__link { padding-right: 2em; display: inline-block; }
.task_item__info { flex: 1 1 auto; }
.task_item__name { font-weight: bold; font-size: 1.1em; }
.task_item__edit { 
  color: #888; font-size: .8em; margin-left: auto; white-space: nowrap; line-height: 1.6em; 
  &:hover { color: #00BCD4; }
}
.task_item__description { margin-block-end: 1em; font-weight: 300; color: #444;}
.task_item__props { color: #444; }
.task_item__priority { display: inline-block; width: .4em; height: .4em; margin-right: 10px; border-radius: 2em; /* box-shadow: 0 2px 1px -2px rgba(0,0,0,.2), 0 1px 2px 0 rgba(0,0,0,.14), 0 0px 5px 0 rgba(0,0,0,.12); */ position: relative; top: -3px;}
.task_item__priority-2 { background-color: #F4511E;}
.task_item__priority-3 { background-color: #FFEB3B;}
.task_item__priority-4 { background-color: #9CCC65;}
.task_item__priority-5 { background-color: #4DD0E1;}
.task_item__priority-6 { background-color: #9575CD;}
</style>