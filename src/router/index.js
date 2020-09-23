import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRouterMap = [{
        path: '/login',
        component: () =>
            import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/auth-redirect',
        component: () =>
            import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import('@/views/home-page/data-statistics'),
            name: 'Dashboard',
            meta: {
                title: 'dashboard',
                icon: 'system',
                affix: true
            }
        }]
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRouterMap = [

    // 设备管理

    // 系统管理
    {
        path: '/systemManagement',
        component: Layout,
        redirect: '/systemManagement/permission-group',
        alwaysShow: true,
        name: 'systemManagement',
        meta: {
            title: 'sysmanagement',
            icon: 'system',
            name: '200001'
        },
        children: [{
                path: 'permission-group',
                component: () =>
                    import('@/views/system-management/permission-group'),
                name: 'PermissionGroup',
                meta: {
                    title: 'pergroup',
                    name: '200001-1'
                }
            },
            {
                path: 'user',
                component: () =>
                    import('@/views/user/user-information'),
                name: 'userinformation',
                meta: {
                    title: 'user',
                    name: '200001-2'
                }
            },
            {
                path: 'employee-rights',
                component: () =>
                    import('@/views/system-management/employee-rights'),

                name: 'EmployeeRights',
                meta: {
                    title: 'emprights'
                },
                hidden: true
            },
            {
                path: 'auditor',
                component: () =>
                    import('@/views/system-management/auditor'),
                name: 'Auditor',
                meta: {
                    title: 'auditor'
                },
                hidden: true
            },
            {
                path: 'asset-access',
                component: () =>
                    import('@/views/system-management/asset-access'),
                name: 'AssetAccess',
                meta: {
                    title: 'assexport'
                },
                hidden: true
            }

        ]
    },



    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import('@/views/home-page/data-statistics'),
            name: 'Dashboard',
            meta: {
                title: 'dashboard',
                icon: '',
                affix: true,
                name: 'home-page'
            }
        }]
    },
    // 首页
    // {
    // 	path: '/homePage', // home page
    // 	component: Layout,
    // 	redirect: '/home-page/permission-group',
    // 	alwaysShow: true,
    // 	name: 'homePage',
    // 	meta: {
    // 		title: 'HomePage',
    // 		icon: 'homePage',
    // 		name: '001'
    // 	},
    // 	children: [{
    // 		path: 'data-statistics', // data statistics
    // 		component: () =>
    // 			import('@/views/home-page/data-statistics'),
    // 		name: 'DataStatistics',
    // 		meta: {
    // 			title: 'dataStatistics',
    // 			name: '001-1'
    // 		}
    // 	}

    // 	]
    // },
    // 订单管理
    {
        path: '/orderManagement', // Order management
        component: Layout,
        redirect: '/order-management/permission-group',
        alwaysShow: true,
        name: 'orderManagement',
        meta: {
            title: 'OrderManagement',
            icon: 'orderManagement',
            name: 'order-manage'
        },
        children: [{
                path: 'order-page',
                component: () =>
                    import('@/views/order-management/order-page'),
                name: 'orderPage',
                meta: {
                    title: 'OrderPage',
                    name: 'order-list'
                }
            },
            {
                path: 'comment-management', // Comment management
                component: () =>
                    import('@/views/order-management/comment-management'),
                name: 'commentManagement',
                meta: {
                    title: 'CommentManagement',
                    name: 'comments-manage'
                }
            },
            {
                path: 'sales-goods', // Sales of goods
                component: () =>
                    import('@/views/order-management/sales-goods'),
                name: 'salesGoods',
                meta: {
                    title: 'SalesGoods',
                    name: 'goods-sell-top'
                }
            }
        ]
    },
    // 商品管理
    {
        path: '/commodityManagement', // Commodity management
        component: Layout,
        redirect: '/commodity-management/product-list',
        alwaysShow: true,
        name: 'commodityManagement',
        meta: {
            title: 'CommodityManagement',
            icon: 'commodityManagement',
            name: 'goods-manage'
        },
        children: [{
                path: 'product-list', // Product list
                component: () =>
                    import('@/views/commodity-management/product-list'),
                name: 'productList',
                meta: {
                    title: 'ProductList',
                    name: 'product-list'
                }
            },
            {
                path: 'productadd', // Product list
                component: () =>
                    import('@/views/commodity-management/productadd'),
                name: 'productadd',
                meta: {
                    title: 'productadd'
                },
                hidden: true,
            },
            {
                path: 'productend', // Product list
                component: () =>
                    import('@/views/commodity-management/productend'),
                name: 'productend',
                meta: {
                    title: 'productend'
                },
                hidden: true,

            },
            {
                path: 'category-management', // Category management
                component: () =>
                    import('@/views/commodity-management/category-management'),
                name: 'categoryManagement',
                meta: {
                    title: 'CategoryManagement',
                    name: 'CategoryManagement'
                }
            },
            {
                path: 'brand-management', // Brand management
                component: () =>
                    import('@/views/commodity-management/brand-management'),
                name: 'brandManagement',
                meta: {
                    title: 'BrandManagement',
                    name: 'BrandManagement'
                }
            },
            {
                path: 'bc-tax', // Brand management
                component: () =>
                    import('@/views/commodity-management/bc-tax'),
                name: 'bcTax',
                meta: {
                    title: 'BcTax',
                    name: 'BcTax'
                }
            },
            {
                path: 'cc-tax', // Brand management
                component: () =>
                    import('@/views/commodity-management/cc-tax'),
                name: 'ccTax',
                meta: {
                    title: 'CcTax',
                    name: 'CcTax'
                }
            },
            {
                path: 'commodity-exhibition', // Commodity exhibition
                component: () =>
                    import('@/views/commodity-management/commodity-exhibition'),
                name: 'commodityExhibition',
                meta: {
                    title: 'CommodityExhibition',
                    name: 'CommodityExhibition'
                }
            },
            {
                path: 'general-problems', // General problems
                component: () =>
                    import('@/views/commodity-management/general-problems'),
                name: 'generalProblems',
                meta: {
                    title: 'GeneralProblems',
                    name: 'GeneralProblems'
                }
            }
        ]
    },
    // 系统管理 system management

    // 推广管理
    {
        path: '/promotionManagement', // Promotion management
        component: Layout,
        redirect: '/promotion-management/permission-group',
        alwaysShow: true,
        name: 'promotionManagement',
        meta: {
            title: 'PromotionManagement',
            icon: 'promotionManagement',
            name: 'PromotionManagement'
        },
        children: [{
                path: 'advertising-management', // Advertising management
                component: () =>
                    import('@/views/promotion-management/advertising-management'),
                name: 'advertisingManagement',
                meta: {
                    title: 'AdvertisingManagement',
                    name: 'AdvertisingManagement'
                }
            },
            {
                path: 'thematic-management', // Thematic management
                component: () =>
                    import('@/views/promotion-management/thematic-management'),
                name: 'thematicManagement',
                meta: {
                    title: 'ThematicManagement',
                    name: 'ThematicManagement'
                }
            }

        ]
    },
    // 会员管理
    {
        path: '/memberManagement', // Member management
        component: Layout,
        redirect: '/member-management/member',
        alwaysShow: true,
        name: 'memberManagement',
        meta: {
            title: 'MemberManagement',
            icon: 'memberManagement',
            name: 'MemberManagement'
        },
        children: [{
                path: 'member', // member
                component: () =>
                    import('@/views/member-management/member'),
                name: 'member',
                meta: {
                    title: 'Member',
                    name: 'Member'
                }
            },
            {
                path: 'address-management', // Address management
                component: () =>
                    import('@/views/member-management/address-management'),
                name: 'addressManagement',
                meta: {
                    title: 'AddressManagement',
                    name: 'AddressManagement'
                }
            },
            {
                path: 'collection-management', // Collection management
                component: () =>
                    import('@/views/member-management/collection-management'),
                name: 'collectionManagement',
                meta: {
                    title: 'CollectionManagement',
                    name: 'CollectionManagement'
                }
            },
            {
                path: 'members-footprints', // Members' footprints
                component: () =>
                    import('@/views/member-management/members-footprints'),
                name: 'membersFootprints',
                meta: {
                    title: 'MembersFootprints',
                    name: 'MembersFootprints'
                }
            },
            {
                path: 'search-management', // Search management
                component: () =>
                    import('@/views/member-management/search-management'),
                name: 'searchManagement',
                meta: {
                    title: 'SearchManagement',
                    name: 'SearchManagement'
                }
            }
        ]
    },
    {
        path: '/system', // system management
        component: Layout,
        redirect: '/system/permission-group',
        alwaysShow: true,
        name: 'system',
        meta: {
            title: 'System',
            icon: 'systems',
            name: 'system-manage'
        },
        children: [{
                path: 'application-management', // Application management
                component: () =>
                    import('@/views/system/application-management'),
                name: 'applicationManagement',
                meta: {
                    title: 'ApplicationManagement',
                    name: 'app-manage'
                }
            },
            {
                path: 'storage', // System page
                component: () =>
                    import('@/views/system/storage'),
                name: 'storage',
                meta: {
                    title: 'storage',
                    name: 'file-manage'
                }
            }

        ]
    },
     // 供货商管理 supplier management
     {
        path: '/supplier', // 
        component: Layout,
        redirect: '/supplier/supplier-list',
        alwaysShow: true,
        name: 'supplier',
        meta: {
            title: 'Supplier',
            icon: 'supplier',
            name: 'supplier'
        },
        children: [
            {
                path: 'supplier-list', // Application management
                component: () =>
                    import('@/views/supplier/supplier-list'),
                name: 'supplierList',
                meta: {
                    title: 'SupplierList',
                    name: 'sup-list'
                }
            }

        ]
    }

]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
