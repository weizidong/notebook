import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Add from '../views/Add.vue'
import Info from '../views/Info.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {path: '/', component: Home},
    {path: '/list/:type', component: List},
    {path: '/add', component: Add},
    {path: '/info/:id', component: Info},
  ]
})
