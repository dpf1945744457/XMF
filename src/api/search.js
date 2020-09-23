import request from '@/utils/request'

// 新增
export function searchpost(data) {
    return request({
        url: '/hot-search',
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
export function searchdelete(data) {
    return request({
        url: '/hot-search',
        method: 'delete',
        params: data
    })
}
export function historydelete(data) {
    return request({
        url: '/search-history',
        method: 'delete',
        params: data
    })
}


// 查询列表
export function searchList(data) {
    return request({
        url: `/hot-search/page`,
        method: 'get',
        params: data
    })
}
export function searchhistoryList(data) {
    return request({
        url: `/search-history/page`,
        method: 'get',
        params: data
    })
}


export function enable(data) {
    return request({
        url: `/hot-search/enable`,
        method: 'put',
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
