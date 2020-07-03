import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  console.log('response', response)
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
