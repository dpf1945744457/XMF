import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import './assets/iconfont/iconfont.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.directive('permission', {
  bind(el, binding, vnode, oldVnode) {
    if (!findPermission(el.getAttribute('permission-taskCode'),el.getAttribute('permission-method'))) {
      // removeChild(el.childNodes[0])
      el.setAttribute('style', 'display:none')
    }
  }
})
function findPermission(taskCode,method) {
  let find = false
  const permissionArray = store.getters.menuperm
  permissionArray.forEach(element => {
    if (element.url === taskCode&&element.method===method) {
      find = true
    }
  })
  return find
}

/* <el-button type="success" size="small"     v-permission
                permission-taskCode="10001-1-3"   @click="handleEdit(scope.row)">编辑</el-button> */
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
var bus = new Vue() // 定义公共实例
export default bus
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
