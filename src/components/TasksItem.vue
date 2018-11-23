<template>
  <div class="main">
    <headers
      :h1="'Задача'"
      :mainMenu="true"
    >
    </headers>

    <div class="wrapper">
      <div class="btn_block">
        <button class="btn btn_round btn_noup" @click="$router.push('/tasks')"><font-awesome-icon icon="chevron-left"></font-awesome-icon> Назад</button>
        <a href="#" class="btn btn_orange btn_round btn_icon mgla"><font-awesome-icon icon="bars"></font-awesome-icon></a>
      </div>

      <div class="page_row">
        <div class="page_row__center">
          <div class="loading" v-if="taskLoader"></div>
          <div class="task_list" v-else>
            <div class="task_item">
              <div class="task_item__info">
                <div class="wbl task_item__top">
                  <div class="task_item__name">
                    <font-awesome-icon v-if="task.priority == 1" icon="fire" class="colorred mgr10"></font-awesome-icon>
                    <div v-else class="task_item__priority" :class="'task_item__priority-' + task.priority"></div>
                    {{task.title}}
                  </div>
                  <a href="#" class="task_item__edit" @click="editTask(task._id)">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon> Редактировать
                  </a>
                </div>
                <div class="wbl font12 mgb20">
                  <div class="colorgrey mgra">
                    <font-awesome-icon icon="comments" class="mgr5"></font-awesome-icon> Комментариев: {{task.commentCount}}
                  </div>
                  <div class="colorgrey mgla mgr20">Создана: {{task.created_date|friendlyDate}}</div>
                  <div class="colorgrey mgr20" v-if="task.updated_date >= task.created_date">Отредактирована:
                    {{task.updated_date|friendlyDate}}</div>
                  <div class="colorgrey"><span v-if="task.active" class="colorgreen b">Активная</span><span v-else class="colorred b">Неактивная</span></div>
                </div>
                <div class="wbl font14">
                  <div class="task_item__props">
                    <div class="task_item__prop_line" v-if="task.maker">Постановщик: {{task.maker}}</div>
                    <div class="task_item__prop_line" v-if="task.deadline_date">Дедлайн: {{task.deadline_date|friendlyOnlyDate}}</div>
                    <div class="task_item__prop_line task_item__description" v-if="task.description" v-html="task.description"></div>
                  </div>
                </div>
              </div>

              <hr class="mgb0">

              <div class="task_item__comments">
                <div class="h4 mgb20">Комментарии:</div>
                <div class="comment">
                  <div class="comment__top wbl">
                    <div class="comment__title">Алексеев Александр</div>
                  </div>
                  <div class="wbl">
                    <div class="txt">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                      dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
                      book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
                      more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </div>
                    <a class="comment__response_link" href="#">ответить</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div class="page_row__right">
          <datepicker :inline="true" :language="datepicker.ru"></datepicker>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import host from '../data/host.js'
import Headers from './common/Headers'
import Modal from './common/Modal'
import Datepicker from 'vuejs-datepicker'
import { en, ru } from 'vuejs-datepicker/dist/locale'

export default {
  name: 'TasksItem',

  components: {
    Headers,
    Modal,
    Datepicker
  },

  data () {
    return {
      datepicker: {
        en: en,
        ru: ru,
      },
      host: host,
      taskLoader: false,
      task: {}

    }
  },

  computed: {
  
  },

  methods: {
    getTask(){
      let id = this.$route.params.id

      this.taskLoader = true
      this.$http.get(`${host.host}/task/${id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.taskLoader = false
        this.task = response.body
      }, response => {
        this.taskLoader = false
      })

    }
  },

  created(){
    document.title = 'CRM | Задача'
    this.getTask()
  }
}
</script>

<style lang="scss" scoped>
.task_item {
  padding: .5em 1em; transition: all .2s ease; margin-bottom: 1em; background-color: #fff; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08); display: flex; align-items: flex-start; flex-direction: column;
}
.task_item__top { display: flex; align-items: flex-start; flex-wrap: nowrap; }
.task_item__link { padding-right: 2em; display: inline-block; }
.task_item__info { flex: 1 1 auto; }
.task_item__name { font-weight: bold; font-size: 1.1em; }
.task_item__edit { 
  color: #888; font-size: .8em; margin-left: auto; white-space: nowrap; line-height: 1.6em; 
  &:hover { text-decoration: underline; }
}
.task_item__description { margin-block-end: 1em; font-weight: 300; color: #444;}




</style>
