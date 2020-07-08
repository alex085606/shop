import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: 'index' */'../components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */'../components/Index.vue')
const Users = () => import(/* webpackChunkName: 'users' */'../components/users/Users.vue')
const Roles = () => import(/* webpackChunkName: 'rights' */'../components/rights/Roles.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */'../components/rights/Rights.vue')
const Categories = () => import(/* webpackChunkName: 'product' */'../components/categories/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'product' */'../components/products/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'product' */'../components/products/GoodsAdd.vue')
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
