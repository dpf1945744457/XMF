import request from '@/utils/request'
export function ccall() {
    return request({
        url: '/cc-tax-rate/all',
        method: 'get'
       
    })
}
export function bcall() {
    return request({
        url: '/tax-rate/all',
        method: 'get'
    })
}
export function categorytree() {
    return request({
        url: '/category/tree',
        method: 'get'
    })
}
export function brandall() {
    return request({
        url: '/brand/all/list',
        method: 'get'
    })
}
export function classifyall() {
    return request({
        url: '/classify/select/list',
        method: 'post'
    })
}
export function merchantall() {
    return request({
        url: '/merchant/all',
        method: 'get'
    })
}
export function goodsadd(data) {
    return request({
        url: '/goods',
        method: 'post',
        data:data
    })
}
export function countryall() {
    return request({
        url: '/country/all/list',
        method: 'get'
    })
}
