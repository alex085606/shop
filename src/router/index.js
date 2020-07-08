import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/rights/Roles.vue'
import Rights from '../components/rights/Rights.vue'
import Categories from '../components/categories/Categories.vue'
import Goods from '../components/products/Goods.vue'
import GoodsAdd from '../components/products/GoodsAdd.vue'
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
      { path: '/rights', component: Rights },
      { path: '/categories', component: Categories },
      { path: '/goods', component: Goods },
      { path: '/goods-add', component: GoodsAdd }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
