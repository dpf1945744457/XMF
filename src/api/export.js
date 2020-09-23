import dlrequest from '@/utils/dlrequest'
import request from '@/utils/request'
export function completeOrder(data) {
    return dlrequest({
        url: '/export/completeOrder',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function preexport(data) {
    return request({
        url: '/pre/export',
        method: 'get',
        params: data
    })
}
export function allocateCargo(data) {
    return dlrequest({
        url: '/export/allocateCargo',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}

export function orderexport(data) {
    return dlrequest({
        url: '/bc/order/export',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}


export function clearanceexport(data) {
    return dlrequest({
        url: '/bc/order/clearance/export',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}

export function clearance(data) {
    return dlrequest({
        url: '/export/clearance',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function delivery(data) {
    return dlrequest({
        url: '/export/delivery',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function financialReconciliation(data) {
    return dlrequest({
        url: '/export/financialReconciliation',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}

export function identity(data) {
    return dlrequest({
        url: '/export/identity',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function liquidation(data) {
    return dlrequest({
        url: '/export/liquidation',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function credentials(data) {
    return dlrequest({
        url: '/export/milk-division-credentials',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function picked(data) {
    return dlrequest({
        url: '/export/picked',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}
export function warehouseOrder(data) {
    return dlrequest({
        url: '/export/warehouseOrder',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}