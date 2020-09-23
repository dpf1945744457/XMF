import { asyncRouterMap, constantRouterMap } from '@/router'
import { getRootMenu, getMenuTrees } from "@/api/menu";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function filterParents(asyncRouterMap, menuData) {
	
  let setRouter = [];
  let menuList = menuData;
  console.log("asyncRouterMap",asyncRouterMap)
  console.log("menuData",menuData)
  asyncRouterMap.forEach(route => {
  	
    if (route.hidden) { // 菜单不需要显示的parent路由
      setRouter.push({
        hidden: true,
        route: route
      });
    }
  })
  menuList.forEach(menuItem => {
    let menuCode = menuItem.taskCode;
    let menuName = menuItem.taskName;
    let menuChild = [];
    if (menuItem.child || menuItem.child.length > 0) {
      menuChild = menuItem.child
    }
    asyncRouterMap.forEach(route => {
      let routeCode = "";
      if (route.meta && route.meta.name) {
        routeCode = route.meta.name;
      }
      if (menuCode == routeCode) {
        route.meta.title = menuName;
        setRouter.push({
          route: route,
          menuChilds: [...menuChild]
        });
      }
    });
  })
  if (setRouter.length > 0) {
    let newParentRouter = [];
    let setRouterMap = setRouter.filter(item => { return item.length != 0 })
    setRouterMap.forEach(item => {
      if (item.hidden) {
        newParentRouter.push(item.route)
      } else {
        let menuArr = item.menuChilds
        let routeArr = item.route.children;
        if (menuArr.length > 0) {
          let routerParent = item.route;
          let routeChild = filterChilds(routeArr, menuArr, []);
          routerParent.children = routeChild;
          if (routeChild.length > 0) {
            newParentRouter.push(routerParent)
          }
        }
      }
    })
    if (newParentRouter) {
      return newParentRouter // 筛选后的一级路由
    } else {
      return [];
    }
  }
}

function filterChilds(routeArr, menuArr) {
  let childArr = [];
  routeArr.forEach(route => {
    // 菜单不需要显示的child路由 与 菜单需要显示的child路由
    if (route.hidden) {
      childArr.push(route);
    }
  })
  menuArr.forEach(menu => {
    routeArr.forEach(route => {
      let routeName = "";
      if (route.meta && route.meta.name) {
        routeName = route.meta.name;
      }
      if (menu.taskCode == routeName) {
        //route.meta.title = menu.taskName;
        childArr.push(route);
      }
    })
  })
  return childArr;
}
function filterAsyncRouter(asyncRouterMap, menuList) {
  let accessedRouters = filterParents(asyncRouterMap, menuList);
  if (!accessedRouters) {
    accessedRouters = [];
  }
  return accessedRouters;

}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    menuList: [],
    permission:[]
  },
  mutations: {
    SET_MENULIST: (state, menuList) => {
      state.menuList = menuList
    },
    SET_ROUTERS: (state, routers) => {
    	console.log("constantRouterMap",constantRouterMap)
    	console.log("routers",routers)
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      
    }, 
    SET_PERMISSION: (state, routers) => {
      state.permission = routers
      
      
    }
  },
  actions: {
    // 获取菜单
    GetMenu({ commit, state }) {
      return new Promise((resolve, reject) => {
        return getRootMenu().then(res => {
          let menulist = res.data;
          commit('SET_MENULIST', menulist);
          resolve(menulist)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GenerateRoutes({ commit }, menuList) {
    	console.log("menuList",menuList)
      	return new Promise(resolve => {
        	let accessedRouters
          accessedRouters = filterAsyncRouter(asyncRouterMap, menuList.menuList);
          let userpush=[]
          menuListpush(userpush,menuList.menuList)
          commit('SET_ROUTERS', accessedRouters)
          commit('SET_PERMISSION', userpush)
        	resolve()
      	})
    },
  }
}

function menuListpush(userpush,menuList){
  menuList.forEach(element => {
    if (element.child) {
      menuListpush(userpush,element.child)
    }else{
      userpush.push(element)
     
    }
  
});

}
//const state = {
//routes: [],
//addRoutes: []
//}
//
//const mutations = {
//SET_ROUTES: (state, routes) => {
//  state.addRoutes = routes
//  state.routes = constantRoutes.concat(routes)
//}
//}
//
//const actions = {
//generateRoutes({ commit }, roles) {
//  console.log("menuList",roles)
// 
//    	return new Promise(resolve => {
//    		debugger
//      	let accessedRouters
//      	accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
//      	commit('SET_ROUTERS', accessedRouters)
//      	resolve()
//    	})
//}
//}

//export default {
//namespaced: true,
//state,
//mutations,
//actions
//}
export default permission