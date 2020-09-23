import request from '@/utils/request'


// 删除
export function footprintdelete(data) {
    return request({
        url: '/admin/footprint/delete',
        method: 'delete',
        params: data
    })
}



// 查询列表
export function searchList(data) {
    return request({
        url: `/admin/footprint/list`,
        method: 'get',
        params: data
    })
}


