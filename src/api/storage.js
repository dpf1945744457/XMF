import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'
// 新增
export function appsadd(data) {
    return request({
        url: '/admin/apps/create',
        method: 'post',
        data: data
    })
}

// 修改
export function storageupdate(data) {
    return request({
        url: '/admin/storage/update',
        method: 'post',
        data: data
    })
}

// 删除
export function storagedelete(data) {
    return request({
        url: '/admin/storage/delete',
        method: 'delete',
        params: data
    })
}
export function storageexport(data) {
    return dlrequest({
        url: '/admin/storage/export',
        method: 'get',
        responseType: 'blob'
    })
}


// 查询列表
export function searchList(data) {
    return request({
        url: `/admin/storage/list`,
        method: 'get',
        params: data
    })
}

const uploadPath =process.env.VUE_APP_BASE_API + '/admin/storage/create'
export { uploadPath }