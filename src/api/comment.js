import request from '@/utils/request'

export function getExamine(data) {
    return request({
        url: '/admin/comment/approval',
        method: 'put',
        params: data
    })
}

export function newComments(data) {
    return request({
        url: '/admin/comment/create',
        method: 'post',
        data: data
    })
}

// 删除评论
export function Delete(data) {
    return request({
        url: '/admin/comment/delete',
        method: 'delete',
        params: data
    })
}

// 评论列表查询
export function getSearchList(data) {
    return request({
        url: '/admin/comment/list',
        method: 'get',
        params: data
    })
}

