import request from '@/utils/request'

// 新增
export function taxratecreate(data) {
    return request({
        url: '/cc-tax-rate',
        method: 'post',
        data: data
    })
}

// 修改
export function taxrateupdate(data) {
    return request({
        url: '/cc-tax-rate',
        method: 'put',
        data: data
    })
}

// 删除
export function taxratedelete(data) {
    return request({
        url: '/cc-tax-rate',
        method: 'delete',
        params: data
    })
}



// 查询列表
export function taxratelist(data) {
    return request({
        url: `/cc-tax-rate/page`,
        method: 'get',
        params: data
    })
}


