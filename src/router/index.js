import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
// import Main from '@/components/Main'
import Users from '@/components/Users'
import Tasks from '@/components/Tasks'
import TasksItem from '@/components/TasksItem'
import Calendar from '@/components/Calendar'
import Money from '@/components/Money'
import Clients from '@/components/Clients'

// import BookList from '@/components/BookList'
// import ShowBook from '@/components/ShowBook'
// import CreateBook from '@/components/CreateBook'
// import EditBook from '@/components/EditBook'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/tasks/id/:id',
      name: 'TasksItem',
      component: TasksItem
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/money',
      name: 'Money',
      component: Money
    },
    {
      path: '/clients',
      name: 'Clients',
      component: Clients
    }

    // {
    //   path: '/books',
    //   name: 'BookList',
    //   component: BookList
    // },
    // {
    //   path: '/show-book/:id',
    //   name: 'ShowBook',
    //   component: ShowBook
    // },
    // {
    //   path: '/add-book',
    //   name: 'CreateBook',
    //   component: CreateBook
    // },
    // {
    //   path: '/edit-book/:id',
    //   name: 'EditBook',
    //   component: EditBook
    // }
  ]
})
