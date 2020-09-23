import request from '@/utils/request'



// 查询列表
export function searchList(data) {
    return request({
        url: `/admin/order/getOrderRemainList`,
        method: 'post',
        data: data
    })
}

