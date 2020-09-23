import request from '@/utils/request'
// import request1 from '@/utils/request1'
export function loginByUsername(data) {
    return request({
        url: '/login',
        method: 'post',
        data: data
    })
}

export function getUserInfo() {
    return request({
        url: '/user-role/userMenuList',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'get'
    })
}
