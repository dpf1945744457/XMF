import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
    getToken
} from '@/utils/auth' // getToken from cookie

NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// 获取当前菜单的功能权限
function GetMenuFunctionList(menu) {
    const menuCode = menu.meta.name;

    // store.dispatch('GetMenuFunctionList', { menuCode: menuCode })
    //  .then(res => { })
    //  .catch(error => { });
}
const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (to.matched.length === 0) {
        //  from.name ? next({ name:from.name }) : next('/');   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
        // store.dispatch('user/FedLogOut').then(() => {
        //   Message.error('验证失败，请输入正确的用户名和密码')
        //   next({ path: '/login' })
        // })
    }
    if (getToken()) { // determine if there has token
        /* has token*/
        if (to.path === '/login') {
            next({
                path: '/'
            })
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('user/GetUserInfo').then(res => { // 拉取user_info
                    store.dispatch('GetMenu').then(menuList => { // 拉取菜单列表
                        store.dispatch('GenerateRoutes', {
                            menuList
                        }).then(() => { // 根据roles权限生成可访问的路由表
                            if (store.getters.addRouters.length > 0) {
                                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                                GetMenuFunctionList(to);
                                console.log(store.getters);
                                next({ ...to,replace: true})
                            } else {
                                store.dispatch('user/FedLogOut').then(() => {
                                    Message.error('该用户没有配置权限')
                                    next({
                                        path: '/login'
                                    })
                                    NProgress.done()
                                })

                            }
                            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                        })
                    }, (error) => {
                        store.dispatch('user/FedLogOut').then(() => {
                            Message.error('获取菜单失败')
                            next({
                                path: '/login'
                            })
                        })
                    })
                }).catch((error) => {
                    // store.dispatch('user/FedLogOut').then(() => {
                    //   Message.error('验证失败，请输入正确的用户名和密码')
                    //   next({ path: '/login' })
                    // })
                })
            } else {
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                if (hasPermission(store.getters.roles, to.meta.roles)) {
                    GetMenuFunctionList(to);
                    next() //
                } else {
                    next({
                        path: '/401',
                        replace: true,
                        query: {
                            noGoBack: true
                        }
                    })
                }
                // 可删 ↑
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到登录页
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
