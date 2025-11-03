import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: { requiresAuth: true } // 需要认证
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true } // 仅限未登录用户访问
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, title: '仪表盘' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true, title: '个人资料', roles: ['admin', 'editor', 'viewer'] }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('@/views/UserManagement.vue'),
    meta: { requiresAuth: true, title: '用户管理', roles: ['admin'] }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue'),
    meta: { requiresAuth: true, title: '无权限' }
  },
  {
    path: '*',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated // 假设你在 Vuex 中存储了认证状态
  const user = store.getters.currentUser
  const userRoles = Array.isArray(user && user.roles) ? user.roles : (user && user.role ? [user.role] : [])
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // 如果未认证，重定向到登录页
      next({
        path: '/login', 
        query: { redirect: to.fullPath } // 保存目标路径以便登录后重定向
      })
    } else {
      // 已认证，进行角色权限校验
      const needRolesRecords = to.matched.filter(record => Array.isArray(record.meta && record.meta.roles) && record.meta.roles.length)
      if (needRolesRecords.length) {
        const hasAccess = needRolesRecords.every(record => record.meta.roles.some(r => userRoles.includes(r)))
        if (!hasAccess) {
          // 无权限强拦截：跳转到 403 页面，并记录来源路径
          next({ path: '/403', query: { from: to.fullPath } })
          return
        }
      }
      next() // 通过校验，放行
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      // 如果已认证但访问的是 guest 路由（如登录页），重定向到首页
      next('/')
    } else {
      next() // 未认证，放行
    }
  } else {
    next() // 其他情况直接放行
  }
})

export default router