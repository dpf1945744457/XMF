import request from '@/utils/request'

// 新增
export function adpost(data) {
    return request({
        url: '/ad',
        method: 'post',
        data: data
    })
}

// 修改
export function adput(data) {
    return request({
        url: '/ad',
        method: 'put',
        data: data
    })
}

// 删除
export function addelete(data) {
    return request({
        url: '/ad',
        method: 'delete',
        params: data
    })
}



// 查询列表
export function searchList(data) {
    return request({
        url: `/ad/page`,
        method: 'get',
        params: data
    })
}
export function topiclist() {
    return request({
        url: `/topic/all/list`,
        method: 'get',
    })
}

