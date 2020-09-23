import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'
// 添加
export function categoryadd(data) {
    return request({
        url: '/category',
        method: 'post',
        data: data
    })
}

// 修改
export function categoryEdit(data) {
    return request({
        url: '/category',
        method: 'put',
        data: data
    })
}

// 删除
export function categorytdelete(data) {
    return request({
        url: '/category',
        method: 'delete',
        params: data
    })
}
export function categoryl1list(data) {
    return request({
        url: '/category/l1/list',
        method: 'get',
        
    })
}

// 禁用
export function categorydisable(data) {
    return request({
        url: '/category/enable',
        method: 'put',
        params: data
    })
}

// 例表
export function categoryList(data) {
    return request({
        url: `/category/page-no/${data.page}/page-size/${data.limit}`,
        method: 'get',
        params: data
    })
}

// 树形列表
export function categorytree(data) {
    return request({
        url: '/category/tree',
        method: 'get',
        data: data
    })
}
export function exportcategory(data) {
    return dlrequest({
        url: '/export/category',
        method: 'get',
        data: data,
        responseType: 'blob'
    })
}
