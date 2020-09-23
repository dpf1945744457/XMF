import request from '@/utils/request'

// 新增
export function appsadd(data) {
    return request({
        url: '/admin/apps/create',
        method: 'post',
        data: data
    })
}

// 修改
export function appsupdate(data) {
    return request({
        url: '/admin/apps/update',
        method: 'post',
        data: data
    })
}

// 删除
export function appselete(data) {
    return request({
        url: '/admin/apps/delete',
        method: 'delete',
        params: data
    })
}



// 查询列表
export function searchList(data) {
    return request({
        url: `/admin/apps/list`,
        method: 'get',
        params: data
    })
}

const uploadPath =process.env.VUE_APP_BASE_API + '/admin/storage/create'
export { uploadPath }