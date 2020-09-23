import request from '@/utils/request'
// import request1 from '@/utils/request1'
export function userlist(data) {
    return request({
        url: '/auth/list',
        method: 'get',
        params: data
    })
}
export function resetPassword(data) {
    return request({
        url: '/auth/resetPassword',
        method: 'get',
        params: data
    })
}

export function usersave(data) {
    return request({
        url: '/auth/save',
        method: 'post',
        data: data
    })
}
export function userupdate(data) {
    return request({
        url: '/auth/update',
        method: 'put',
        data: data
    })
}

export function usersetEnable(data) {
    return request({
        url: '/auth/setEnable',
        method: 'get',
        params: data
    })
}
export function usergetDeptTree() {
    const data = {
        systemCode: 10001
    }
    return request({
        url: '/dept/deptPermission/getDeptTree',
        method: 'get',
        params: data
    })
}

export function userfindUserRoleList(data) {
    return request({
        url: '/auth/findUserRoleList',
        method: 'get',
        params: data
    })
}
export function usersetRole(data) {
    return request({
        url: '/auth/setRole',
        method: 'post',
        data: data
    })
}


export function updatePassword(data) {
    return request({
        url: '/auth/updatePassword',
        method: 'get',
        params: data
    })
}
