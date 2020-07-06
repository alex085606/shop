import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'

Vue.use(VueRouter)
// 修复重复点击同一个 item 的导航 bug
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
