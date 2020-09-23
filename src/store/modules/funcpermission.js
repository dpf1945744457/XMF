//import { getMenuFunctionList } from '@/api/menu_manage'
import { getRootMenu, getMenuTrees,getMenuFunctionList } from "@/api/menu";
import { getToken, setToken, removeToken } from '@/utils/auth'

const funcpermission = {
  state: {
    funcList: ""
  },

  mutations: {
    SET_FUNCLIST: (state, funcList) => {
      state.funcList = funcList
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 获取用户信息
    GetMenuFunctionList({ commit, state }, data) {
      return new Promise((resolve, reject) => {
//      let menuCode = data.menuCode;
//      if (menuCode) {
//        getMenuFunctionList({
//          menuCode: menuCode
//        }).then(res => {
//          if (res.errno == '0') {
//            const data = res.data;
//            commit('SET_FUNCLIST', data)
//          }
//        }).catch(error => {
//          reject(error)
//        })
//      } else {
//        reject("weberror")
//      }
      })
    },
  }
}

export default funcpermission
