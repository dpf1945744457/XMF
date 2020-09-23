import request from '@/utils/request'

// 获取
export function getCollectList(data) {
    return request({
        url: '/admin/collect/list',
        method: 'get',
        params: data
    })
}

// 删除
export function getDelete(data) {
    return request({
        url: '/admin/collect/delete',
        method: 'delete',
        params: data
    })
}
