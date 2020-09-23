import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'
// 新增
export function goodsadd(data) {
    return request({
        url: '/goods',
        method: 'post',
        data: data
    })
}

// 修改
export function goodsend(data) {
    return request({
        url: '/goods',
        method: 'put',
        data: data
    })
}

// 删除
export function goodsdelete(data) {
    return request({
        url: `/goods/goods-id/${data.goodsId}`,
        method: 'delete'
    })
}



// 查询列表
export function goodsList(data) {
    return request({
        url: `/goods/page/page-no/${data.pageNum}/page-size/${data.pageSize}`,
        method: 'get',
        params: data
    })
}

// 分类列表
export function goodsrecommend(data) {
    return request({
        url: '/goods/recommend',
        method: 'put',
        params:data
    })
}
export function goodssale(data) {
    return request({
        url: '/goods/sale',
        method: 'put',
        params:data
    })
}
export function goodsid(data) {
    return request({
        url: `/goods/goods-id/${data.goodsId}`,
        method: 'get',
        data:data
    })
}
export function goodsexport(data) {
    return dlrequest({
        url: `/goods/export/`,
        method: 'get',
        data:data,
        responseType: 'blob'
    })
}
export function goodspriceexport(data) {
    return dlrequest({
        url: `/goods-price/export/`,
        method: 'get',
        data:data,
        responseType: 'blob'
    })
}
