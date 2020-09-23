import request from '@/utils/request'
export function goodsSellTop(data) {
    return request({
        url: '/admin/order/goodsSellTop',
        method: 'get',
        params: data
    })
}

export function cartSellTop(data) {
    return request({
        url: '/cart/info',
        method: 'get',
        params: data
    })
}

