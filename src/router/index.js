import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Datepicker from '@/components/Datepicker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/datepicker',
      name: 'Datepicker',
      component: Datepicker
    }
  ]
})
