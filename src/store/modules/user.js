import { loginByUsername, logout, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken,getTokens, setTokens, removeTokens } from '@/utils/auth'
import router, {
	resetRouter
} from '@/router'

// const user = {

	const state = {
		user: '',
		status: '',
		code: '',
		token: getToken(),
		name: '',
		avatar: '',
		introduction: '',
		roles: [],
		setting: {
			articlePlatform: []
		}
	}

	const mutations = {
		SET_CODE: (state, code) => {
			state.code = code
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
	}

	const actions = {
    	// 用户名登录
		LoginByUsername({ commit, dispatch }, userInfo) {
			const { account, password, systemCode } = userInfo;
			return new Promise((resolve, reject) => {
				loginByUsername({
					account: account,
					password: password,
					systemCode: systemCode
				}).then(response => {
					const { data } = response;
					commit('SET_TOKEN', data.token)
					setToken(data.token)
					
					setTokens("user",JSON.stringify(data))
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
    // 获取用户信息

		GetUserInfo({ commit, state }) {
			return new Promise((resolve, reject) => {
				getUserInfo().then(response => {
					const data = response.data;
					commit('SET_ROLES', data)

					//    commit('SET_NAME', name)
					//    commit('SET_AVATAR', avatar)
					//    commit('SET_INTRODUCTION', introduction)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
		  removeToken()
		  removeTokens('user')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(res => {
          const data = res.data;
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }

  }

// }
// export default user
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
