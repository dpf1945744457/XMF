import request from '@/utils/request'
import dlrequest from '@/utils/dlrequest'

import Qs from "qs";
export function orderlist(data) {
    let stringGet = Qs.stringify(data);
    console.log(stringGet);
    // return false;
    stringGet = stringGet.replace(/%5B\d%5D/gi, "");
    return request({
        url: '/admin/order/list?' + stringGet,
        method: 'get'

    })
}
export function detailOrder(data) {
    return request({
        url: '/admin/order/detail',
        method: 'get',
        params: data
    })
}
export function orderClose(data) {
    return request({
        url: '/admin/order/orderClose',
        method: 'post',
        data: data
    })
}
export function orderrefund(data) {
    return request({
        url: '/admin/order/refund',
        method: 'post',
        data: data
    })
}

export function makePackBarCode(data) {
    return request({
        url: '/admin/order/makePackBarCode',
        method: 'post',
        data: data
    })
}
export function pickUpImport(data) {
    return request({
        url: '/admin/order/pickUp',
        method: 'post',
        data: data
    })
}
export function updateOrderGoodsPurchasePrice(data) {
    return request({
        url: '/admin/order/updateOrderGoodsPurchasePrice',
        method: 'put',
        data: data
    })
}
export function shipOrder(data) {
    return request({
        url: '/admin/order/ship',
        method: 'post',
        data: data
    })
}
export function updateShoppingReceipts(data) {
    return request({
        url: '/admin/order/updateShoppingReceipts',
        method: 'post',
        data: data
    })
}
export function cancelRefund(data) {
    return request({
        url: '/admin/order/cancelRefund',
        method: 'put',
        params: data
    })
}
export function orderexport(data) {
    return dlrequest({
        url: '/admin/order/export',
        method: 'get',
        params: data,
        responseType: 'blob'
    })
}


export function shipbillImport(data) {
    return request({
        url: '/admin/order/admin/order/import/waybill',
        method: 'post',
        data: data,

    })
}
export function queryTrack(data) {
    return request({
        url: '/admin/order/queryTrack',
        method: 'get',
        params: data,

    })
}

// // 修改
// export function brandput(data) {
//     return request({
//         url: '/brand',
//         method: 'put',
//         data: data
//     })
// }

// // 删除
// export function branddelete(data) {
//     return request({
//         url: '/brand',
//         method: 'delete',
//         params: data
//     })
// }



// // 查询列表
// export function searchList(data) {
//     return request({
//         url: `/brand/page-no/${data.pageNum}/page-size/${data.pageSize}`,
//         method: 'get',
//         params: data
//     })
// }

// // 分类列表
// export function brandlist() {
//     return request({
//         url: '/brand/all/list',
//         method: 'get',
//     })
// }
