import request from '@/utils/request'

// 新增
export function topicpost(data) {
    return request({
        url: '/topic',
        method: 'post',
        data: data
    })
}

// 修改
export function topicput(data) {
    return request({
        url: '/topic',
        method: 'put',
        data: data
    })
}

// 删除
export function topicdelete(data) {
    return request({
        url: '/topic',
        method: 'delete',
        params: data
    })
}



// 查询列表
export function searchList(data) {
    return request({
        url: `/topic/page`,
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
