//import Vue from 'vue'
//import Vuex from 'vuex'
//import getters from './getters'
//
//Vue.use(Vuex)
//
//// https://webpack.js.org/guides/dependency-management/#requirecontext
//const modulesFiles = require.context('./modules', true, /\.js$/)
//
//// you do not need `import app from './modules/app'`
//// it will auto require all vuex module from modules file
//const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//// set './app.js' => 'app'
//const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//const value = modulesFiles(modulePath)
//modules[moduleName] = value.default
//return modules
//}, {})
//
//const store = new Vuex.Store({
//modules,
//getters
//})
//
//export default store
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import settings from './modules/settings'
import funcpermission from './modules/funcpermission'
import getters from './getters'
import errorLog from './modules/errorLog'

Vue.use(Vuex)

const store = new Vuex.Store({
modules: {
    app,
    permission,
    tagsView,
    user,
    funcpermission,
    settings,
    errorLog
},
getters,
state: {},
mutations: {},
actions: {},
})

export default store

