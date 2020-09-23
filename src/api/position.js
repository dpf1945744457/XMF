import request from '@/utils/request'
import http from './http'
// 删除
export function getDelete(data) {
    return request({
        url: '/admin/address/delete',
        method: 'delete',
        params: data
    })
}

// 获取
export function getAddressList(data) {
    return request({
        url: '/admin/address/list',
        method: 'get',
        params: data
    })
}

// 编辑
export function getEdit(data) {
    return request({
        url: '/admin/address/update',
        method: 'put',
        data: data
    })
}
export const getAddressData = async(params) => {
    try {
        // let citydata = JSON.parse(localStorage.getItem("citydata"));
        // // 如果有缓存 返回缓存数据
        // if (citydata instanceof Array)
        //     return Promise.resolve(citydata);

        // 否则去请求数据
        const data = await http.get('select_area.json?t=' + Date.now(), params, true, true);
        // localStorage.setItem("citydata", JSON.stringify(data));
        if (data instanceof Array) { return Promise.resolve(data); }
    } catch (error) {
        return Promise.reject(error);
    }
}
// 地区
// export function placeList(data) {
//     return request({
//         url:'',
//         method: 'get',
//         data: data
//     })
// }
