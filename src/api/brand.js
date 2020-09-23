import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'
// 新增
export function brandpost(data) {
    return request({
        url: '/brand',
        method: 'post',
        data: data
    })
}

// 修改
export function brandput(data) {
    return request({
        url: '/brand',
        method: 'put',
        data: data
    })
}

// 删除
export function branddelete(data) {
    return request({
        url: '/brand',
        method: 'delete',
        params: data
    })
}



// 查询列表
export function searchList(data) {
    return request({
        url: `/brand/page-no/${data.pageNum}/page-size/${data.pageSize}`,
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
export function brandexport(data) {
    return dlrequest({
        url: '/brand/export',
        method: 'get',
        data:data,
        responseType: 'blob'
    })
}
