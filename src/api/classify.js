import request from '@/utils/request'

// 新增
export function classifypost(data) {
    return request({
        url: '/classify',
        method: 'post',
        data: data
    })
}

// 修改
export function classifyput(data) {
    return request({
        url: '/classify',
        method: 'put',
        data: data
    })
}

// 删除
export function classifydelete(data) {
    return request({
        url: '/classify',
        method: 'delete',
        params: data
    })
}

// 禁用
export function classifyenable(data) {
    return request({
        url: '/classify/enable',
        method: 'post',
        params: data
    })
}

// 查询列表
export function searchList(data) {
    return request({
        url: `/classify/page-no/${data.pageNum}/page-size/${data.pageSize}`,
        method: 'get',
        params: data
    })
}

// 分类列表
export function getModify(data) {
    return request({
        url: '/classify/select/list',
        method: 'post',
        data: data
    })
}
