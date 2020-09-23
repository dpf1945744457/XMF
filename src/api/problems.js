import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'
// 新增
export function issuepost(data) {
    return request({
        url: '/issue',
        method: 'post',
        data: data
    })
}

// 修改
export function issueput(data) {
    return request({
        url: '/issue',
        method: 'put',
        data: data
    })
}
export function issueexport(data) {
    return dlrequest({
        url: '/issue/export',
        method: 'get',
        data: data,
        responseType: 'blob'
    })
}


// 删除
export function issuedelete(data) {
    return request({
        url: '/issue',
        method: 'delete',
        params: data
    })
}
// 查询列表
export function searchList(data) {
    return request({
        url: `/issue/page/page-no/${data.pageNum}/page-size/${data.pageSize}`,
        method: 'get',
        params: data
    })
}
