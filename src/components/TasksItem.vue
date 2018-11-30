<template>
  <div class="main">
    <headers
      :h1="'Задача'"
      :mainMenu="true"
    >
    </headers>

    <div class="wrapper">
      <div class="btn_block">
        <button class="btn btn_round btn_noup btn_blank" @click="$router.push('/tasks')"><font-awesome-icon icon="chevron-left"></font-awesome-icon> Назад</button>
        <a href="javascript:;" class="btn btn_orange btn_round btn_icon mgla"><font-awesome-icon icon="bars"></font-awesome-icon></a>
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
                  <a href="javascript:;" class="task_item__edit" @click="editTask(task._id)">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon> Редактировать
                  </a>
                </div>
                <div class="wbl font12 mgb20">
                  <div class="colorgrey mgra">
                    <font-awesome-icon icon="comments" class="mgr5"></font-awesome-icon> Комментариев: {{task.comments.length}}
                  </div>
                  <div class="colorgrey mgla mgr20">Создана: {{task.createdAt|friendlyDate}}</div>
                  <div class="colorgrey mgr20" v-if="task.updated_date >= task.created_date">Отредактирована:
                    {{task.updated_date|friendlyDate}}</div>
                  <div class="colorgrey"><span v-if="task.active" class="colorgreen b">Активная</span><span v-else class="colorred b">Неактивная</span></div>
                </div>
                <div class="wbl font14">
                  <div class="task_item__props">
                    <div class="task_item__prop_line mgb5" v-if="task.creator">Постановщик: {{task.creator}}</div>
                    <div class="task_item__prop_line mgb30" v-if="task.deadLine">Дедлайн: {{task.deadLine|friendlyOnlyDate}}</div>
                    <template v-if="task.description">
                      <div class="task_item__prop_line task_item__description txt" v-if="task.description" v-html="task.description"></div>
                    </template>
                    <hr class="mgb10">
                    <a class="comment__response_link" href="javascript:;" @click="showAddComment(0)">ответить</a>

                    <div v-if="firstComment" class="addCommentForm">
                      <div class="loading" v-if="addCommentLoader"></div>
                      <template v-else>
                        <div class="form-group mgb10">
                          <label>Написать комментарий</label>
                          <quill-editor v-model="newComment.text" ref="addCommentEditor" :options="editorOption">
                          </quill-editor>
                        </div>
                        <div class="form-group mgb10">
                          <button class="btn btn-green btn_noup" @click="addComment">Отправить</button>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="task_item" v-if="task.comments.length > 0">
              <div class="task_item__comments">
                <div class="h4 mgb20">Комментарии:</div>

                  <v-tree :scope-data="commentsTree">
                    <div slot-scope="menuLevel" class="comment_list">

                      <div class="comment" :class="{'comment-with_comments': comment.children.length > 0}" v-for="(comment, key) in menuLevel">
                        
                        <div class="comment__info">
                          <div class="comment__top wbl">
                            <img src="https://cdn.dribbble.com/users/16041/avatars/small/e6c7fac4033b9c233a3bd82ce55c4430.jpg" alt="" class="comment__user">

                            <div class="comment__title">{{comment.creator}}</div>
                            <div class="colorgrey font12 mgl20">{{comment.addedAt|friendlyDate}}</div>
                            <div class="colorgrey font12 mgla">id: {{comment.comment_id}}, parent: {{comment.parent}}</div>
                          </div>
                          <div class="txt" v-html="comment.text"></div>
        
                          <a class="comment__response_link" href="javascript:;" @click="showAddComment(comment.comment_id)" v-if="!comment.addComment">ответить</a>

                          <div v-if="comment.addComment" class="addCommentForm">
                            <div class="loading" v-if="addCommentLoader"></div>
                            <template v-else>
                              <div class="form-group mgb10">
                                <label>Написать комментарий</label>
                                <quill-editor v-model="newComment.text" ref="addCommentEditor" :options="editorOption">
                                </quill-editor>
                              </div>
                              <div class="form-group mgb10">
                                <button class="btn btn-green btn_noup" @click="addComment">Отправить</button>
                              </div>
                            </template>
                          </div>
                        </div>
                        <v-tree v-if="comment.children.length > 0" :scope-data="comment.children"></v-tree>
                      </div>

                    </div>
                  </v-tree>

              </div>
            </div>
          </div>
        </div>
        <div class="page_row__right">
          <datepicker :inline="true" :language="datepicker.ru" :monday-first="true"></datepicker>
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
      editorOption: {
        placeholder: '',
        modules: {

        }
      },
      datepicker: {
        en: en,
        ru: ru,
      },
      host: host,
      taskLoader: false,
      task: {
        comments: []
      },
      addCommentLoader: false,
      firstComment: false,
      newCommentTemplate: {
        parent: 0,
        text: ''
      }
    
    }
  },

  computed: {
    token() {
      return localStorage.getItem('token')
    },

    taskId(){
      return this.$route.params.id
    },

    newComment() {
      this.$set(this.newCommentTemplate, 'comment_id', this.task.comments.length + 1)
      return this.newCommentTemplate
    },

    sortedComments(){
      return this.task.comments.map((item) => {
        this.$set(item, 'addComment', false)
        return item
      })
    },

    commentsTree(){
      let arr = this.sortedComments,
          tree = [],
          mappedArr = {},
          arrElem,
          mappedElem;

      // hash obj
      for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.comment_id] = arrElem;
        mappedArr[arrElem.comment_id]['children'] = [];
      }

      for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id];
          if (mappedElem.parent) {
            mappedArr[mappedElem['parent']]['children'].push(mappedElem);
          } else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    }
  },

  methods: {
    getTask(){
      let id = this.$route.params.id

      this.taskLoader = true
      this.$http.get(`${host.host}/task/${id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': this.token
        }
      }).then(response => {
        this.taskLoader = false
        this.task = response.body
      }, response => {
        this.taskLoader = false
      })
    },

    showAddComment(key){
      let comments = this.task.comments 

      this.newComment.parent = key
      this.firstComment = false

      for(let i=0; i < comments.length; i++){
        comments[i].addComment = false
        if (key == comments[i].comment_id) {
          comments[i].addComment = true
        }
      }

      if (key == 0) this.firstComment = true
    },

    addComment(){
      this.addCommentLoader = true
      this.$http.post(`${host.host}/task/comment/${this.taskId}`, this.newComment, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': this.token
        }
      }).then(response => {
        this.addCommentLoader = false
        this.newCommentTemplate.text = ''
        this.task.comments.push(this.newComment)
        this.getTask()
      }, response => {
        this.addCommentLoader = false

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
  padding: .5em 1em; transition: all .2s ease; margin-bottom: 1em; background-color: #fff; /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08); */ display: flex; align-items: flex-start; flex-direction: column;
}
.task_item__top { display: flex; align-items: flex-start; flex-wrap: nowrap; }
.task_item__link { padding-right: 2em; display: inline-block; }
.task_item__info { width: 100%; }
.task_item__name { font-weight: bold; font-size: 1.1em; }
.task_item__edit { 
  color: #888; font-size: .8em; margin-left: auto; white-space: nowrap; line-height: 1.6em; 
  &:hover { color: #00BCD4; }
  &-delete { color: #00BCD4; }
}
.task_item__description { margin-block-end: 1em; font-weight: 400; color: #444; width: 100%; padding: .7em; box-sizing: border-box; background-color: #f6f6f6; }
.task_item__comments { width: 100%; }
.task_item__props { margin-bottom: 2em; width: 100%; }

.comment { display: flex; align-items: flex-start; flex-wrap: wrap; position: relative; margin-bottom: 1.3em; }
.comment__top { align-items: center; }
.comment__title { font-weight: bold; font-size: 12px; }
.comment__user {
    border-radius: 100px;
    margin-right: .5em;
    /* -webkit-box-shadow: 0 0 0 0.3em #fff, 0 0 0 0.33em #ccc;
    box-shadow: 0 0 0 0.3em #fff, 0 0 0 0.33em #ccc; */
    width: 24px;
    height: 24px;
    position: relative;
    z-index: 3;
}
.comment__info { flex: 1 1 auto; }
.addCommentForm { padding: .7em; box-sizing: border-box; background-color: #f6f6f6; }

.comment_list { flex: 0 0 100%; box-sizing: border-box;  }
.comment .comment_list { padding-left: 1em; margin-top: 1em; position: relative; }
.comment .comment_list:before { content: ''; position: absolute; margin: auto; left: 0; top: -2px; bottom: 13px; border-left: 1px solid #ddd; }
.comment .comment_list .comment { margin-bottom: 10px; }

@media (max-width: 980px) {
  .page_row__right { display: none; }
}
</style>