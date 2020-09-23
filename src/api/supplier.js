import request from '@/utils/request'

// 新增
export function merchantAdd(data) {
    return request({
        url: '/merchant/add',
        method: 'post',
        data: data
    })
}

// 例表
export function merchantList(data) {
    return request({
        url: '/merchant/list',
        method: 'get',
        params: data
    })
}

//修改
export function editList(data) {
    return request({
        url: '/merchant/update',
        method: 'post',
        data: data
    })
}
// 删除
export function deleteList(data) {
    return request({
        url: '/merchant/delete',
        method: 'delete',
        params: data
    })
}
