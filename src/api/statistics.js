import request from '@/utils/request'// 商家列表

// 获取首页统计数据
export function getDashboard(data) {
	return request({
		url: '/admin/dashboard/',
		method: 'get',
		data: data
	})
}

// 获取商品统计数据
export function getGoods(data) {
	return request({
		url: '/admin/stat/goods',
		method: 'get',
		params: data
	})
}

// 获取订单统计数据
export function getOrder(data) {
	return request({
		url: '/admin/stat/order',
		method: 'get',
		params: data
	})
}

// 获取用户统计数据
export function getUser(data) {
	return request({
		url: '/admin/stat/statUserData',
		method: 'get',
		params: data
	})
}

// 获取日活用户统计数据
export function getUserActive(data) {
	return request({
		url: '/admin/stat/userActive',
		method: 'get',
		params: data
	})
}
