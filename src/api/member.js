import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'
// 新增
export function brandpost(data) {
    return request({
        url: '/brand',
        method: 'post',
        data: data
    })
}

// 修改
export function memberupdate(data) {
    return request({
        url: '/admin/member/update',
        method: 'post',
        data: data
    })
}

// 删除
export function branddelete(data) {
    return request({
        url: '/brand',
        method: 'delete',
        params: data
    })
}


export function memberexport(data) {
    return dlrequest({
        url: '/admin/member/export',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
// 查询列表
export function searchList(data) {
    return request({
        url: `/admin/member/list`,
        method: 'get',
        params: data
    })
}

// 分类列表
export function brandlist() {
    return request({
        url: '/brand/all/list',
        method: 'get',
    })
}
