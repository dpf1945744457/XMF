import request from '@/utils/request'
// 导航菜单根目录
export function getRootMenu() {
	return request({
		url: '/user-role/userMenuList',
		method: 'get',
	})
}


// 管理权限新增
export function getMenuTrees(data) {
//	return http.request({
//		url: '/shiro/menuTree',
//		method: 'get',
//		params: data
//	})
}


export function getMenuFunctionList() {
	return request({
		url: '/user-role/userMenuList',
		method: 'get',
	})
}