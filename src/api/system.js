import request from '@/utils/request'


export function deleteSystem(id) {
	return request({
	    url: `/system/delete?id=${id}`,
	    method: 'delete'
	})
}

export function updateSystem(data) {
	return request({
	    url: "/system/update",
	    method: 'put',
	    data
	})
}


export function getSystemList(data) {
  return request({
    url: "/system/list",
    method: 'get',
    params: data
  })
}

export function saveSystem(data) {
	return request({
	    url: '/system/save',
	    method: 'post',
	    data
	})
}
export function deptsetEnable(data) {
	return request({
	    url: '/dept/setEnable',
	    method: 'post',
	    params:data
	})
}
export function rolesetEnable(data) {
	return request({
	    url: '/role/setEnable',
	    method: 'post',
	    params:data
	})
}

export function getDeptList(data) {
  return request({
    url: "/dept/list",
    method: 'get',
    params: data
  })
}

export function getDeptPermission(data) {
  return request({
    url: "/dept/deptPermission/getAll",
    method: 'get',
    params: data
  })
}

export function saveDept(data) {
	return request({
	    url: '/dept/save',
	    method: 'post',
	    data
	})
}

export function operatorDept(data) {
	return request({
	    url: '/dept/deptPermission/operator',
	    method: 'post',
	    data
	})
}

export function updateDept(data) {
	return request({
	    url: "/dept/update",
	    method: 'put',
	    data
	})
}

export function deleteDept(id) {
	return request({
	    url: `/dept/delete?id=${id}`,
	    method: 'delete'
	})
}

export function getRoleList(data) {
  return request({
    url: "/role/list",
    method: 'get',
    params: data
  })
}

export function getRolePermission(data) {
  return request({
    url: "/role/rolePermission/getAll",
    method: 'get',
    params: data
  })
}

export function saveRole(data) {
	return request({
	    url: '/role/save',
	    method: 'post',
	    data
	})
}

export function operatorRole(data) {
	return request({
	    url: '/role/rolePermission/operator',
	    method: 'post',
	    data
	})
}

export function updateRole(data) {
	return request({
	    url: "/role/update",
	    method: 'put',
	    data
	})
}


export function deleteRole(id) {
	return request({
	    url: `/role/delete?id=${id}`,
	    method: 'delete'
	})
}

export function getMenuList(data) {
  return request({
    url: "/task/list",
    method: 'get',
    params: data
  })
}

export function getDeptMenuList(data) {
  return request({
    url: "/task/dept/list",
    method: 'get',
    params: data
  })
}

export function saveMenu(data) {
	return request({
	    url: '/task/save',
	    method: 'post',
	    data
	})
}


export function updateMenu(data) {
	return request({
	    url: "/task/update",
	    method: 'put',
	    data
	})
}

export function deleteMenu(id) {
	return request({
	    url: `/task/delete?id=${id}`,
	    method: 'delete'
	})
}